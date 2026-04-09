using AngularAuthApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AngularAuthApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TokenController(IAuthService authService) : ControllerBase
{
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(TokenDto tokenDto)
    {
        if (tokenDto is null) return BadRequest("Invalid client request");

        var response = await authService.RefreshTokenAsync(tokenDto);

        if (response == null) return BadRequest("Invalid client request");

        return Ok(response);
    }
}
