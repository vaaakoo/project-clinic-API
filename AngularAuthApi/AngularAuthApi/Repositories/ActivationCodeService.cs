using AngularAuthApi.Repositories.Interfaces;
using System.Net.Mail;
using System.Net;
using System.Text;

namespace AngularAuthApi.Repositories
{
    public class ActivationCodeService : IActivationCodeService
    {
        public Task<string> GenerateActivationCodeAsync()
        {
            Random rnd=new Random();
            StringBuilder code=new StringBuilder();
            for(int i=0; i<4; i++)
            {
                code.Append(rnd.Next(10));
            }
            return Task.FromResult(code.ToString());
        }

        public async Task SendActivationCodeAsync(string email, string activationCode, string body, string subject)
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
                IsBodyHtml = false,
            };

            mailMessage.To.Add(email);

            await smtpClient.SendMailAsync(mailMessage);
        }

    }
}
