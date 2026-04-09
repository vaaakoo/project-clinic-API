using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;

namespace AngularAuthApi.Services
{
    public class AuthService(
        AppDbContext context,
        IActivationCodeService activationCodeService,
        IPasswordResetService passwordResetService,
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
            var activationCode = await activationCodeService.GenerateActivationCodeAsync();
            var subject = "აქტივაციის კოდი";
            var body = $@"
                <html>
                    <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333;'>
                        <div style='max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'>
                            <h1 style='color: #3498db;'>{subject}</h1>
                            <p>ძვირფასო მომხმარებელო,</p>
                            <p>მადლობას გიხდით ჩვენი კომპანიის სერვისით სარგებლობისთვის</p>
                            <p>თქვენი აქტივაციის კოდი არის:</p>
                            <div style='background-color: #3498db; color: #fff; padding: 10px; border-radius: 5px; font-size: 18px; font-weight: bold;'>{activationCode}</div>
                            <p>გთხოვთ ფრთხილად იყავით, თქვენი კოდი არ გაუზიაროთ სხვას.</p>
                            <p>წარმატებებს გისურვებთ ვლადიმერი!</p>
                        </div>
                    </body>
                </html>";

            await activationCodeService.SendActivationCodeAsync(email, activationCode, body, subject);
            return activationCode;
        }

        public async Task<string> SendResetCodeAsync(string email)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || user.Role == "admin")
                throw new Exception("Unable to reset password for this user.");

            var resetCode = await passwordResetService.GenerateResetCodeAsync();
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(resetCode);
            await context.SaveChangesAsync();

            var subject = "პაროლის აღდგენა";
            var body = $@"
                <html>
                    <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333;'>
                        <div style='max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'>
                            <h1 style='color: #3498db;'>{subject}</h1>
                            <p>ძვირფასო <strong>{user.FirstName}</strong>,</p>
                            <p>თქვენი ახალი პაროლი არის:</p>
                            <div style='background-color: #3498db; color: #fff; padding: 10px; border-radius: 5px; font-size: 18px; font-weight: bold;'>{resetCode}</div>
                            <p>თქვენი კოდი არ გაუზიაროთ სხვას.</p>
                            <p>წარმატებებს გისურვებთ ვლადიმერი!</p>
                        </div>
                    </body>
                </html>";

            await passwordResetService.SendResetCodeAsync(email, resetCode, body, subject);
            return resetCode;
        }

        private UserResponseDto MapToResponseDto(User user)
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
