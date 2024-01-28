using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AngularAuthYtAPI.Models;
using AngularAuthYtAPI.Context;

namespace AngularAuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        private readonly int _jwtExpirationDays = 1;

        public AuthenticationController(AppDbContext authContext)
        {
            _authContext = authContext;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUser loginModel)
        
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Case-insensitive email search
            var user = await _authContext.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == loginModel.Email.ToLower());

            if (user == null)
            {
                // User not found
                return Unauthorized(new { Message = "Invalid credentials" });
            }

            // Verify hashed password
            if (!BCrypt.Net.BCrypt.Verify(loginModel.Password, user.PasswordHash))
            {
                // Invalid password
                return Unauthorized(new { Message = "Invalid credentials" });
            }


            // Rest of your logic...

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                User = user,
                Token = token,
                ExpiresIn = _jwtExpirationDays * 60 * 60 // Token expiration time in seconds
            });
        }


        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("YourSuperStrongSecretKeyWithAtLeast256Bits");
            var claims = new ClaimsIdentity(new[]
            {
            new Claim(ClaimTypes.Name, user.FirstName),
            new Claim(ClaimTypes.NameIdentifier, user.IdNumber),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("UserId", user.Id.ToString())


    });

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.Add(TimeSpan.FromDays(_jwtExpirationDays)),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
