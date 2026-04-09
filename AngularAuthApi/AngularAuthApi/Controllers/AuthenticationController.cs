using AngularAuthApi.Models;
using AngularAuthApi.Models.DTOs;
using AngularAuthApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AngularAuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthenticationController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUser loginModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _authService.LoginAsync(loginModel);

            if (response == null)
            {
                return Unauthorized(new { Message = "Invalid credentials" });
            }

            return Ok(response);
        }
    }
}
