using ITransitionTask4.Middlewares;
using ITransitionTask4.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

JwtSetting _jwtSetting =builder.Configuration.GetSection("JwtSettings")
    .Get<JwtSetting>()!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).
    AddJwtBearer( JwtBearerDefaults.AuthenticationScheme, options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidAudience = _jwtSetting.Audience,
        ValidIssuer = _jwtSetting.Issuer,
        IssuerSigningKey =  new SymmetricSecurityKey( Encoding.UTF32.GetBytes(_jwtSetting.Key))
    };
});


builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddScoped<JwtService>();
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddScoped<IEmailService, EmailService>();


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
        .AllowAnyHeader().AllowAnyMethod();
    });
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors();
app.UseHttpsRedirection();


app.UseAuthentication();

app.UseAuthorization();

app.UseRequest();


app.MapControllers();

app.Run();
