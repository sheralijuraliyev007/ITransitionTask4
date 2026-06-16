namespace ITransitionTask4.Data.Entities
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("verification_token")]
        public Guid? VerificationToken { get; set; }

        [Column("password_reset_token")]
        public Guid? PasswordResetToken { get; set; }

        [Column("password_reset_token_expiry")]
        public DateTimeOffset? PasswordResetTokenExpiry { get; set; }


        [Required]
        [Column("joined_date")]
        public DateTimeOffset JoinedDate { get; set; }


        [Column("last_seen_time")]
        public DateTimeOffset? LastSeenTime { get; set; }

        [Required]
        [Column("first_name")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [Column("last_name")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [Column("password_hash")]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("occupation")]
        public string? Occupation { get; set; }

        [Required]
        [Column("status")]
        public UserStatus Status { get; set; }

        [Column("previous_status")]
        public UserStatus? PreviousStatus { get; set; }

    }
}