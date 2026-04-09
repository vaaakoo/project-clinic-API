namespace AngularAuthApi.Services
{
    public interface ICodeGeneratorService
    {
        string GenerateNumericCode(int length = 4);
        string GenerateAlphaNumericCode(int length = 8);
    }

    public class CodeGeneratorService : ICodeGeneratorService
    {
        public string GenerateNumericCode(int length = 4)
        {
            var rnd = new Random();
            var code = new System.Text.StringBuilder();
            for (int i = 0; i < length; i++)
            {
                code.Append(rnd.Next(10));
            }
            return code.ToString();
        }

        public string GenerateAlphaNumericCode(int length = 8)
        {
            return Guid.NewGuid().ToString("N").Substring(0, length);
        }
    }
}
