namespace ITransitionTask4.Services
{
    public class JwtService(IConfiguration configuration)
    {
        private readonly JwtSetting _jwtSetting = configuration.GetSection("JwtSettings")
            .Get<JwtSetting>()!;


        public string GenerateToken(User user, bool rememberMe)
        {
            var key = Encoding.UTF32.GetBytes(_jwtSetting.Key);

            var signingKey = new SigningCredentials(new SymmetricSecurityKey(key), "HS256");

            var claims = new List<Claim>()
            {
                new (ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.Email)
            };

            var security = new JwtSecurityToken(
                issuer: _jwtSetting.Issuer,
                audience: _jwtSetting.Audience,
                signingCredentials: signingKey,
                claims: claims,
                expires: rememberMe ? DateTime.UtcNow.AddDays(7) : DateTime.UtcNow.AddMinutes(30));

            var accessToken = new JwtSecurityTokenHandler().WriteToken(security);

            return accessToken;
        }
        
    }
}
