using System.Threading.Tasks;

namespace AngularAuthApi.Repositories.Interfaces
{
    public interface IPasswordResetService
    {
        Task<string> GenerateResetCodeAsync();
        Task SendResetCodeAsync(string email, string resetCode, string body, string subject);
    }
}
