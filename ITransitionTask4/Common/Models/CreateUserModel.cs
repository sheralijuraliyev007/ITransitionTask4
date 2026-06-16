namespace ITransitionTask4.Common.Models
{
    public class CreateUserModel
    {
        [Required]
        public string FirstName { get; set; } 

        [Required]
        public string LastName { get; set; } 

        [Required]
        //[MinLength(1)]
        public string Password { get; set; } 

        [EmailAddress]
        [Required]
        public string Email { get; set; } 

        public bool RememberMe { get; set; }

        public string? Occupation { get; set; }

    }
}
