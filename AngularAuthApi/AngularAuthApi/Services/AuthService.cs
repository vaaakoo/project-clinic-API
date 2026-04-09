using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;

namespace AngularAuthApi.Services
{
    public class AuthService(
        AppDbContext context,
        ICodeGeneratorService codeGenerator,
        IEmailService emailService,
        IOptions<JwtSettings> jwtSettings) : IAuthService
    {
        private readonly JwtSettings _jwtSettings = jwtSettings.Value;

        public async Task<AuthResponseDto?> LoginAsync(LoginUser loginModel)
        {
            var user = await context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == loginModel.Email.ToLower());

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginModel.Password, user.PasswordHash))
                return null;

            var accessToken = GenerateJwtToken(user);
            var refreshToken = CreateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await context.SaveChangesAsync();

            return new AuthResponseDto
            {
                User = MapToResponseDto(user),
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresIn = _jwtSettings.ExpirationDays * 24 * 60 * 60
            };
        }

        public string GenerateJwtToken(User user)
        {
            var handler = new JsonWebTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);

            var descriptors = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity([
                    new Claim(ClaimTypes.Name, user.FirstName ?? ""),
                    new Claim(ClaimTypes.NameIdentifier, user.IdNumber ?? ""),
                    new Claim(ClaimTypes.Email, user.Email ?? ""),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim("UserId", user.Id.ToString())
                ]),
                Expires = DateTime.UtcNow.AddDays(_jwtSettings.ExpirationDays),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            return handler.CreateToken(descriptors);
        }

        public string CreateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public async Task<AuthResponseDto?> RefreshTokenAsync(TokenDto tokenDto)
        {
            var principal = await GetPrincipalFromExpiredTokenAsync(tokenDto.AccessToken);
            var email = principal.FindFirstValue(ClaimTypes.Email);

            if (string.IsNullOrEmpty(email)) return null;

            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || user.RefreshToken != tokenDto.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                return null;

            var newAccessToken = GenerateJwtToken(user);
            var newRefreshToken = CreateRefreshToken();

            user.RefreshToken = newRefreshToken;
            await context.SaveChangesAsync();

            return new AuthResponseDto
            {
                User = MapToResponseDto(user),
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                ExpiresIn = _jwtSettings.ExpirationDays * 24 * 60 * 60
            };
        }

        private async Task<ClaimsPrincipal> GetPrincipalFromExpiredTokenAsync(string token)
        {
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateLifetime = false
            };

            var tokenHandler = new JsonWebTokenHandler();
            var result = await tokenHandler.ValidateTokenAsync(token, tokenValidationParameters);

            if (!result.IsValid)
                throw new SecurityTokenException("Invalid token");

            return new ClaimsPrincipal(result.ClaimsIdentity);
        }

        public async Task<bool> ChangePasswordAsync(PasswordChangeRequest request)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.OldPassword, user.PasswordHash))
                return false;

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<string> SendActivationCodeAsync(string email)
        {
            var activationCode = codeGenerator.GenerateNumericCode(4);
            
            // Store in DB for verification later
            var activationEntity = new ActivationCode
            {
                Email = email,
                Code = activationCode,
                CreationTime = DateTime.UtcNow,
                ExpirationTime = DateTime.UtcNow.AddMinutes(10),
                Used = false
            };
            context.ActivationCodes.Add(activationEntity);
            await context.SaveChangesAsync();

            var placeholders = new Dictionary<string, string>
            {
                { "Code", activationCode }
            };

            await emailService.SendEmailAsync(email, "Clinic Activation Code", "ActivationCode", placeholders);
            return activationCode;
        }

        public async Task<string> SendResetCodeAsync(string email)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || user.Role == "admin")
                throw new Exception("Unable to reset password for this user.");

            var resetCode = codeGenerator.GenerateAlphaNumericCode(8);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(resetCode);
            await context.SaveChangesAsync();

            var placeholders = new Dictionary<string, string>
            {
                { "Name", user.FirstName ?? "User" },
                { "Password", resetCode }
            };

            await emailService.SendEmailAsync(email, "Clinic Password Recovery", "PasswordReset", placeholders);
            return resetCode;
        }

        private static UserResponseDto MapToResponseDto(User user)
        {
            return new UserResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                Role = user.Role,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IdNumber = user.IdNumber,
                Category = user.Category,
                starNum = user.starNum,
                ImageUrl = user.ImageUrl,
                CvUrl = user.CvUrl,
                IsAdmin = user.IsAdmin
            };
        }
    }
}
