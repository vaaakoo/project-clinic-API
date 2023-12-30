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
        public Task<string> GenerateResetCodeAsync()
        {
            // Generate a random password for the reset code
            string resetCode = Guid.NewGuid().ToString("N").Substring(0, 8);
            return Task.FromResult(resetCode);
        }

        public async Task SendResetCodeAsync(string email, string resetCode, string body, string subject)
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("vaktonik@gmail.com", "gwponglvmipzhaja"),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("vaktonik@gmail.com"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };

            mailMessage.To.Add(email);

            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}
