using AngularAuthApi.Models;
using AngularAuthApi.Models.DTOs;
using System.Threading.Tasks;

namespace AngularAuthApi.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginUser loginModel);
        string GenerateJwtToken(User user);
        string CreateRefreshToken();
        Task<AuthResponseDto?> RefreshTokenAsync(TokenDto tokenDto);
        Task<bool> ChangePasswordAsync(PasswordChangeRequest request);
        Task<string> SendActivationCodeAsync(string email);
        Task<string> SendResetCodeAsync(string email);
    }

    public class AuthResponseDto
    {
        public UserResponseDto User { get; set; } = null!;
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public int ExpiresIn { get; set; }
    }
}
