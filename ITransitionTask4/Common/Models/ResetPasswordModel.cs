namespace ITransitionTask4.Common.Models
{
    public class ResetPasswordModel
    {

        public Guid Token { get; set; }

        public string NewPassword { get; set; }
    }
}
