namespace ITransitionTask4.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtService _jwtService;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        
        public AuthService(IUserRepository userRepository, JwtService jwtService, IServiceScopeFactory serviceScopeFactory)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
            _serviceScopeFactory = serviceScopeFactory;
            
        }

        public async Task<string> ForgotPasswordAsync(string email)
        {
            var (isExist, user) = await DoesExist(email);

            if (!isExist) return $"User with email address : {email} doesn't exist in database";

            user!.PasswordResetToken = Guid.NewGuid();
            user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1);
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            _ = Task.Run(async () =>
            {
                try
                {
                    using var scope = _serviceScopeFactory.CreateScope();
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
                    var resetLink = $"http://82.208.22.154/reset-password?token={user.PasswordResetToken}";
                    await emailService.SendEmailAsync(
                        user.Email,
                        "Reset your password",
                        $"""
                        <h2>Password Reset</h2>
                        <p>Click the link below to reset your password. It expires in 1 hour.</p>
                        <a href="{resetLink}">Reset Password</a>
                        <p>If you didn't request this, ignore this email.</p>
                        """);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            });

            return "The password reset link has been sent";
        }

        public async Task<(bool Success, string Message)> LoginAsync(LoginUserModel model)
        {
            var(isExist, user) = await DoesExist(model.Email);
            if (!isExist) return (false, $"User with {model.Email} does not exist");
            
    
            if(new PasswordHasher<User>().
                VerifyHashedPassword(user!, user!.PasswordHash, model.Password) == PasswordVerificationResult.Failed)
                    return (false,"Password is incorrect");

            return (true, _jwtService.GenerateToken(user, model.RememberMe));
        }

        public async Task<(bool Success, string Message)> RegisterAsync(CreateUserModel model)
        {
            var user = new User
            {
                Email = model.Email,
                FirstName = model.FirstName,
                Occupation = model.Occupation,
                LastName = model.LastName,
                VerificationToken = Guid.NewGuid(),
                JoinedDate = DateTime.UtcNow,
                LastSeenTime = DateTime.UtcNow,
            };

            var passwordHash = new PasswordHasher<User>().HashPassword(user, model.Password);
            user.PasswordHash = passwordHash;
            user.Status = UserStatus.Unverified;

            try
            {
                await _userRepository.AddAsync(user);
            }
            catch(DbUpdateException ex)
            {
                return (false, ex.InnerException?.Message ?? ex.Message);
            }


            _ = Task.Run(async () =>
            {
                try
                {
                    using var scope = _serviceScopeFactory.CreateScope();
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
                    var verificationLink = $"http://82.208.22.154/verify-email?token={user.VerificationToken}";
                    await emailService.SendEmailAsync(
                        user.Email,
                        "Verify Your Email",
                        $"<a href='{verificationLink}'>Verify Email</a>"
                    );
                    Console.WriteLine("Email sent successfully"); 
                }
                catch (Exception x)
                {
                    Console.WriteLine($"EMAIL ERROR: {x.Message}"); 
                    Console.WriteLine($"EMAIL ERROR DETAIL: {x.InnerException?.Message}");
                }
            });
            return (true, "Registered successfully");

        }

        public async Task<string> ResetPasswordAsync(Guid token, string newPassword)
        {
            var user = await _userRepository.GetAll().Where(u => u.PasswordResetToken == token).FirstOrDefaultAsync();

            if (user == null) {
                return "Invalid or expired link";
            }

            if (user.PasswordResetTokenExpiry == null ||
                    DateTime.UtcNow > user.PasswordResetTokenExpiry.Value)
                return "Reset link has expired. Please request a new one.";

            user.PasswordHash = new PasswordHasher<User>().HashPassword(user, newPassword);
            user.PasswordResetToken = null;       
            user.PasswordResetTokenExpiry = null;

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();
            return "Password reset successfully.";
        }

        public async Task<string> VerifyEmail(Guid verificationToken)
        {
            var user = await _userRepository.GetAll().Where(u => u.VerificationToken == verificationToken)
                .FirstOrDefaultAsync();

            if (user == null) {
                return "User not found";
            }
            user.PreviousStatus = user.Status;
            user.Status = UserStatus.Active;
            user.VerificationToken = null;

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            return "verified";
        }

        private async Task<Tuple<bool, User?>> DoesExist(string email)
        {
            var user =  await _userRepository.GetAll().Where(u => u.Email == email).FirstOrDefaultAsync();
            return new(user != null, user);
        }


    }
}
