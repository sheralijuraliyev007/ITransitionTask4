
using System.Net;
using System.Net.Mail;

namespace ITransitionTask4.Services
{
    public class EmailService(IConfiguration configuration) : IEmailService
    {
        private readonly EmailSettings _emaiSettings = configuration.GetSection("EmailSettings")
            .Get<EmailSettings>();



        public async Task SendEmailAsync(string email, string subject, string body)
        {
            var from = _emaiSettings.From;
            var smtpServer = _emaiSettings.SmtpServer;
            var port = _emaiSettings.Port;
            var username = _emaiSettings.Username;
            var password = _emaiSettings.Password;

            var message = new MailMessage(from, email, subject, body);
            message.IsBodyHtml = true;

            using var client = new SmtpClient(smtpServer, port)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true
            };

            await client.SendMailAsync(message);

        }
    }
}
