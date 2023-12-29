namespace AngularAuthApi.Repositories.Interfaces
{
    public interface IActivationCodeService
    {
        Task<string> GenerateActivationCodeAsync();
        Task SendActivationCodeAsync(string email, string activationCode,string body,string subject);
       
    }
}
