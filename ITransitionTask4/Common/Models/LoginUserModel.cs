namespace ITransitionTask4.Common.Models
{
    public class LoginUserModel
    {

        public bool RememberMe { get; set; }

        [Required]
        public string Password { get; set; }

        [EmailAddress]
        [Required]
        public string Email { get; set; }
    }
}
