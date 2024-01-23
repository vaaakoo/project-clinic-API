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
        private readonly int _jwtExpirationDays = 7;

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

            var user = await _authContext.Users.FirstOrDefaultAsync(u => u.Email == loginModel.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginModel.Password, user.Password))
            {
                // Invalid credentials
                return Unauthorized(new { Message = "Invalid credentials" });
            }


            // Check for admin credentials
            if (user.Email == "admin" && loginModel.Password == "admin")
            {
                user.Role = "admin";
            }
            else if (!string.IsNullOrEmpty(user.Category))
            {
                // User has a category, assume it's a doctor
                user.Role = "doctor";
            }

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                User = user,
                Token = token,
                ExpiresIn = _jwtExpirationDays * 24 * 60 * 60 // Token expiration time in seconds
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
