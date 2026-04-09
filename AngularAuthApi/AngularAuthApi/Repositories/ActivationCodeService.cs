using AngularAuthApi.Repositories.Interfaces;
using System.Net.Mail;
using System.Net;
using System.Text;
using AngularAuthApi.Context;
using AngularAuthApi.Models;

namespace AngularAuthApi.Repositories
{
    public class ActivationCodeService : IActivationCodeService
    {
        private readonly AppDbContext _dbContext;
        private readonly EmailSettings _emailSettings;

        public ActivationCodeService(AppDbContext dbContext, IOptions<EmailSettings> emailSettings)
        {
            _dbContext = dbContext;
            _emailSettings = emailSettings.Value;
        }

        public Task<string> GenerateActivationCodeAsync()
        { 
            Random rnd = new Random();
            StringBuilder code = new StringBuilder();
            for (int i = 0; i < 4; i++)
            {
                code.Append(rnd.Next(10));
            }
            return Task.FromResult(code.ToString());
        }

        public async Task SendActivationCodeAsync(string email, string activationCode, string body, string subject)
        {
            try
            {
                var activationCodeEntity = new ActivationCode
                {
                    Email = email,
                    Code = activationCode,
                    CreationTime = DateTime.Now,
                    ExpirationTime = DateTime.Now.AddMinutes(10), // Increased from 2 to 10 minutes
                    Used = false
                };

                _dbContext.ActivationCodes.Add(activationCodeEntity);
                await _dbContext.SaveChangesAsync();

                using (var smtpClient = new SmtpClient(_emailSettings.SmtpServer))
                {
                    smtpClient.Port = _emailSettings.Port;
                    smtpClient.Credentials = new NetworkCredential(_emailSettings.Username, _emailSettings.Password);
                    smtpClient.EnableSsl = _emailSettings.EnableSsl;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(_emailSettings.FromEmail),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = true,
                    };
                    mailMessage.To.Add(email);

                    await smtpClient.SendMailAsync(mailMessage);
                }
            }
            catch (Exception ex)
            {
                // Log or handle the exception as needed
                throw new Exception("Error sending activation code via email", ex);
            }
        }

    }
}
