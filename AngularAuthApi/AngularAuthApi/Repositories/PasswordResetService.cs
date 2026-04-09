using AngularAuthApi.Repositories.Interfaces;
using System;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace AngularAuthApi.Repositories
{
    public class PasswordResetService : IPasswordResetService
    {
        private readonly EmailSettings _emailSettings;

        public PasswordResetService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public Task<string> GenerateResetCodeAsync()
        {
            // Generate a random password for the reset code
            string resetCode = Guid.NewGuid().ToString("N").Substring(0, 8);
            return Task.FromResult(resetCode);
        }

        public async Task SendResetCodeAsync(string email, string resetCode, string body, string subject)
        {
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
    }
}
