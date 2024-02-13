using AngularAuthApi.Repositories.Interfaces;
using System.Net.Mail;
using System.Net;
using System.Text;
using AngularAuthYtAPI.Context;
using AngularAuthApi.Models;

namespace AngularAuthApi.Repositories
{
    public class ActivationCodeService : IActivationCodeService
    {
        private readonly AppDbContext _dbContext;

        public ActivationCodeService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
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

            try
            {
                // Store the activation code in the database
                var activationCodeEntity = new ActivationCode
                {
                    Email = email,
                    Code = activationCode,
                    CreationTime = DateTime.Now,
                    ExpirationTime = DateTime.Now.AddMinutes(2), // Set expiration time
                    Used = false
                };

                _dbContext.ActivationCodes.Add(activationCodeEntity);
                await _dbContext.SaveChangesAsync();

                // Send activation code via email
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
            catch (Exception ex)
            {
                // Log or handle the exception as needed
                throw new Exception("Error sending activation code via email", ex);
            }
        }

    }
}
