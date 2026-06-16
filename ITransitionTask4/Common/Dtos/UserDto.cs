namespace ITransitionTask4.Common.Dtos
{
    public class UserDto
    {
        public Guid Id { get; set; }

        public string FirstName { get; set; } 

        public string LastName { get; set; } 

        public string Email { get; set; }

        public string? Occupation { get; set; }

        public UserStatus Status { get; set; } 

        public DateTimeOffset JoinedDate { get; set; }

        public DateTimeOffset? LastSeenTime { get; set; }

    }
}
