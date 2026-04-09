using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using AngularAuthApi.Models.Configuration;

namespace AngularAuthApi.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string templateName, Dictionary<string, string> placeholders, CancellationToken ct = default);
    }

    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<EmailService> _logger;

        public EmailService(
            IOptions<EmailSettings> settings, 
            IWebHostEnvironment env, 
            ILogger<EmailService> logger)
        {
            _settings = settings.Value;
            _env = env;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string templateName, Dictionary<string, string> placeholders, CancellationToken ct = default)
        {
            try
            {
                // Inject common branding placeholders
                if (!placeholders.ContainsKey("ApplicationName"))
                    placeholders["ApplicationName"] = _settings.ApplicationName;
                
                if (!placeholders.ContainsKey("Year"))
                    placeholders["Year"] = DateTime.Now.Year.ToString();

                var body = await GetTemplateAsync(templateName, placeholders, ct);

                using var smtpClient = new SmtpClient(_settings.SmtpServer)
                {
                    Port = _settings.Port,
                    Credentials = new NetworkCredential(_settings.Username, _settings.Password),
                    EnableSsl = _settings.EnableSsl
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_settings.FromEmail, _settings.ApplicationName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(to);

                await smtpClient.SendMailAsync(mailMessage, ct);
                _logger.LogInformation("Email sent successfully to {Email} with template {Template}", to, templateName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {Email}", to);
                throw;
            }
        }

        private async Task<string> GetTemplateAsync(string name, Dictionary<string, string> placeholders, CancellationToken ct)
        {
            var path = Path.Combine(_env.ContentRootPath, "Resources", "EmailTemplates", $"{name}.html");
            
            if (!File.Exists(path))
            {
                // Fallback for development if bin folder is different
                path = Path.Combine(AppContext.BaseDirectory, "Resources", "EmailTemplates", $"{name}.html");
            }

            if (!File.Exists(path))
                throw new FileNotFoundException($"Email template not found: {path}");

            var template = await File.ReadAllTextAsync(path, ct);

            foreach (var kvp in placeholders)
            {
                template = template.Replace($"{{{{{kvp.Key}}}}}", kvp.Value);
            }

            return template;
        }
    }
}
