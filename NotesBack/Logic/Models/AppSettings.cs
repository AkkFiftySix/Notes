namespace Logic.Models;
public class AppSettings
{
    public JwtSettings JwtSettings { get; set; }
    public bool ConstantConfirmationCode { get; set; }
}

public class JwtSettings
{
    public string Issuer { get; set; }
    public string Audience { get; set; }
    public string Key { get; set; }
    public int MinutesToExpiration { get; set; }
}
