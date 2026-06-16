namespace ITransitionTask4.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string email, string subject, string body);
    }
}
