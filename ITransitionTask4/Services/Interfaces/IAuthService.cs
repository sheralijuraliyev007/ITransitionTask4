namespace ITransitionTask4.Services.Interfaces
{
    public interface IAuthService
    {
        Task<(bool Success, string Message)> RegisterAsync(CreateUserModel model);

        Task<(bool Success, string Message)> LoginAsync(LoginUserModel model);


        Task<string> ForgotPasswordAsync(string email);

        Task<string> ResetPasswordAsync(Guid token, string newPassword);

        Task<string> VerifyEmail(Guid verificationToken);
    }
}
