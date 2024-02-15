using AngularAuthYtAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using System.Text;
using AngularAuthYtAPI.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using System.Net.Http.Headers;
using AngularAuthApi.Repositories.Interfaces;
using AngularAuthApi.Repositories;
using System.Net.Mail;
using AngularAuthApi.Models;


namespace AngularAuthYtAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        private static string globalActivationCode = string.Empty;
        private readonly IActivationCodeService _activationCodeService;
        private readonly IPasswordResetService _passwordResetService;
        private static DateTime activationCodeExpirationTime;


        public UserController(AppDbContext context, IActivationCodeService activationCodeService, IPasswordResetService passwordResetService)
        {
            _authContext = context;
            _activationCodeService = activationCodeService;
            _passwordResetService = passwordResetService;

            if (!_authContext.Users.Any())
            {
                SeedInitialData();
            }

            if (!_authContext.Users.Any(u => u.Email == "admin"))
            {
                SeedAdminUser();
            }

        }
        private void SeedAdminUser()
        {
            var adminUser = new User
            {
                FirstName = "Admin",
                LastName = "Admin",
                Password = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin"),
                IdNumber = "00000000000", 
                Category = null,
                starNum = 0,
                Email = "admin", 
                Role = "admin",
                ImageUrl = "/assets/admin-image.jpg",
                IsAdmin = true
            };

            _authContext.Users.Add(adminUser);
            _authContext.SaveChanges();
        }

        /* if it empty saved this static */
        private void SeedInitialData()
        {
            var initialDoctors = new List<User>
        {
            new User { FirstName = "გიორგი", LastName = "ხორავა",Password = "123456", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000001", Category = "ანდროლოგი",starNum = 5, Email = "1@gmail.com", Role = "doctor", ImageUrl = "/assets/image1.jpg", IsAdmin = false},
            new User { FirstName = "ნატალია", LastName = "გოგოხია",Password = "123456", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000002", Category = "ანესთეზიოლოგი", starNum = 3, Email = "2@gmail.com", Role = "doctor", ImageUrl = "/assets/image2.jpg", IsAdmin = false },
            new User { FirstName = "ანა", LastName = "დვლაი",Password = "123456", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000003", Category = "კარდიოლოგი", starNum = 4, Email = "3@gmail.com", Role = "doctor", ImageUrl = "/assets/image3.jpg", IsAdmin = false },
            new User { FirstName = "გიორგი", LastName = "გაბიტაშვილი",Password = "123456", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000004", Category = "კოსმეტოლოგი", starNum = 5, Email = "4@gmail.com", Role = "doctor", ImageUrl = "/assets/image4.jpg", IsAdmin = false },
            new User { FirstName = "ბარბარე", LastName = "ქორთუა", Password = "123456", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000005", Category = "ლაბორანტი", starNum = 3, Email = "5@gmail.com", Role = "doctor", ImageUrl = "/assets/image5.jpg", IsAdmin = false },
            new User { FirstName = "გიორგი", LastName = "ხორავა", Password = "123456", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000006", Category = "პედიატრი", starNum = 3, Email = "6@gmail.com", Role = "doctor", ImageUrl = "/assets/image6.jpg", IsAdmin = false },
            new User { FirstName = "ნატალია", LastName = "გაბიტაშვილი", Password = "123456", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000007", Category = "ოჯახის ექიმი", starNum = 5, Email = "7@gmail.com", Role = "doctor", ImageUrl = "/assets/image7.jpg", IsAdmin = false },
            new User { FirstName = "გიორგი", LastName = "დვალი",Password = "123456", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000008", Category = "ტოქსიკოლოგი", starNum = 2, Email = "8@gmail.com", Role = "doctor", ImageUrl = "/assets/image8.jpg", IsAdmin = false },
            new User { FirstName = "ანა", LastName = "გაბიტაშვილი", Password = "123456", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000009", Category = "ტრანსფუზილოგი", starNum = 5, Email = "9@gmail.com", Role = "doctor", ImageUrl = "/assets/image9.jpg", IsAdmin = false },
            new User { FirstName = "დავით", LastName = "გიუნაშვილი", Password = "123456", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000010", Category = "ოჯახის ექიმი", starNum = 4, Email = "10@gmail.com", Role = "doctor", ImageUrl = "/assets/image9.jpg", IsAdmin = false },
            new User { FirstName = "ზურაბ", LastName = "ანთაძე", Password = "123456", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000011", Category = "თერაპევტი", starNum = 3, Email = "11@gmail.com", Role = "doctor", ImageUrl = "/assets/image9.jpg", IsAdmin = false },
            new User { FirstName = "ვაკო", LastName = "ჯანიკა", Password = "123456", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="10000000001", Email = "v@gmail.com", Role = "client", ImageUrl = "/assets/image3.jpg", IsAdmin = false },
            new User { FirstName = "დავით", LastName = "გიუნა", Password = "123456", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="10000000002", Email = "d@gmail.com", Role = "client", ImageUrl = "/assets/image3.jpg", IsAdmin = false },
            new User { FirstName = "გიროგი", LastName = "გიორგაძე", Password = "123456", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="10000000003", Email = "g@gmail.com", Role = "client", ImageUrl = "/assets/image3.jpg", IsAdmin = false },

        };

            _authContext.Users.AddRange(initialDoctors);
            _authContext.SaveChanges();
        }






        [HttpPost("register")]
        public async Task<IActionResult> AddUser([FromBody] User userObj)
        {
            if (userObj == null)
                return BadRequest();

            //check username
            if (userObj.Email == "admin" && userObj.Password == "admin")
            {
                return BadRequest(new { Message = "შეცდომაა!" });
            }

            if (!IsValidEmail(userObj.Email))
                return BadRequest(new { Message = "მეილის ფორმატი არასწორია!" });

            // check email
            if (await CheckEmailExistAsync(userObj.Email))
                return BadRequest(new { Message = "ეს მეილი გამოყენებულია! გთხოვთ გაიაროთ ავტორიზაცია." });

            //check username
            if (await CheckIdNumberExistAsync(userObj.IdNumber))
                return BadRequest(new { Message = "შეცდომა! პირადი ნომერი უნდა შეიცავდეს 11 ციფრს!" });

            /*if (userObj.activationcode != globalActivationCode)
                return BadRequest(new { Message = "Activation Code is In Valid" });*/

            var activationCodeEntity = await _authContext.ActivationCodes.FirstOrDefaultAsync(ac => ac.Email == userObj.Email && ac.Code == userObj.activationcode && !ac.Used && ac.ExpirationTime > DateTime.Now);
            if (activationCodeEntity == null)
            {
                if (DateTime.Now > activationCodeExpirationTime)
                {
                    return BadRequest(new { Message = "აქტივაციის კოდი ვადაგასულია!" });
                }
                
                return BadRequest(new { Message = "აქტივაციის კოდი არასწორია ან/და გამოყენებული!" });
            }

            var passMessage = CheckPasswordStrength(userObj.Password);
            if (!string.IsNullOrEmpty(passMessage))
                return BadRequest(new { Message = passMessage.ToString() });

            userObj.Role = "client";

            userObj.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userObj.Password);

            activationCodeEntity.Used = true;
            _authContext.Update(activationCodeEntity);

            await _authContext.AddAsync(userObj);
            await _authContext.SaveChangesAsync();

            return Ok(new
            {
                Status = 200,
                Message = "რეგისტრაცია გავლილია!"
            });
        }

        
        [HttpPost("doctor-register")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AddDoctor([FromBody] User userObj)
        {
            if (userObj == null)
                return BadRequest();
            if (string.IsNullOrEmpty(userObj.Email) || string.IsNullOrEmpty(userObj.Password) || string.IsNullOrEmpty(userObj.Category) || string.IsNullOrEmpty(userObj.Password) || string.IsNullOrEmpty(userObj.FirstName) || string.IsNullOrEmpty(userObj.LastName) || string.IsNullOrEmpty(userObj.IdNumber))
                return BadRequest(new { Message = "Please Fill All Records" });

            if (!IsValidEmail(userObj.Email))
                return BadRequest(new { Message = "Invalid email format" });
            if (await CheckEmailExistAsync(userObj.Email))
                return BadRequest(new { Message = "Email Already Exist" });

            //check username
            if (await CheckIdNumberExistAsync(userObj.IdNumber))
                return BadRequest(new { Message = "Invalid or already existing ID number. ID number must be 11 digits." });

            var passMessage = CheckPasswordStrength(userObj.Password);
            if (!string.IsNullOrEmpty(passMessage))
                return BadRequest(new { Message = passMessage.ToString() });

            userObj.Role = "doctor";
            userObj.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userObj.Password);
            await _authContext.AddAsync(userObj);
            await _authContext.SaveChangesAsync();

            return Ok(new
            {
                Status = 200,
                Message = $"{userObj.Role} is Added!"
            });
        }


        private string CheckPasswordStrength(string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                return "Password cannot be empty.";
            }

            // Define the regular expressions for password requirements
            var hasMinimumLength = new Regex(@".{12,}");
            var hasLowerChar = new Regex(@"[a-z]");
            var hasUpperChar = new Regex(@"[A-Z]");
            var hasDigit = new Regex(@"\d");
            var hasSpecialChar = new Regex(@"[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]");

            // Check if the password meets each requirement
            if (!hasMinimumLength.IsMatch(password))
            {
                return "პაროლი უნდა შეიცავდეს მინიმუმ 12 სიმბოლოს.";
            }

            if (!hasLowerChar.IsMatch(password))
            {
                return "პაროლი უნდა შეიცავდეს პატარა ანბანის ასოს!";
            }

            if (!hasUpperChar.IsMatch(password))
            {
                return "პაროლი უნდა შეიცავდეს ერთ დიდ ანბანის ასოს.";
            }

            if (!hasDigit.IsMatch(password))
            {
                return "პაროლი უნდა შეიცავდეს ციფრს!";
            }

            if (!hasSpecialChar.IsMatch(password))
            {
                return "პაროლი უნდა შეიცავდეს ერთ სიმბოლოს!";
            }

            return string.Empty; 
        }


        private async Task<bool> CheckEmailExistAsync(string? email)
            => await _authContext.Users.AnyAsync(x => x.Email.Equals(email));


        private async Task<bool> CheckIdNumberExistAsync(string? idNumber)
        {
            if (idNumber == null || idNumber.Length != 11 || !idNumber.All(char.IsDigit))
            {
                return true; 
            }

            return await _authContext.Users.AnyAsync(x => x.IdNumber == idNumber);
        }


        private bool IsValidEmail(string email)
        {
            string emailRegex = @"^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$";

            return System.Text.RegularExpressions.Regex.IsMatch(email, emailRegex);
        }

        [HttpGet("getDoctor")]
        public IActionResult GetDoctor()
        {
            try
            {
                var users = _authContext.Users.Where(p=>p.Category!=null).ToList();
                return Ok(users);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);

                return StatusCode(500, new { Message = "Internal Server Error" });
            }
        }

        [HttpGet("getDoctor/{id}")]
        public IActionResult GetDoctorById(int id)
{
        try
        {
            var doctor = _authContext.Users.FirstOrDefault(u => u.Id == id && u.Category != null);

            if (doctor == null)
            {
                return NotFound();
            }

            return Ok(doctor);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine(ex);
            return StatusCode(500, new { Message = "Internal Server Error" });
        }
}


        [HttpGet("getDoctorByIdNumber")]
        public IActionResult getDoctorByIdNumber(string IdNumber)
        {
            try
            {
                var doctor = _authContext.Users.FirstOrDefault(u => u.IdNumber == IdNumber && u.Category != null);

                if (doctor == null)
                {
                    return NotFound();
                }

                return Ok(doctor);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(500, new { Message = "Internal Server Error" });
            }
        }

        [HttpPut("updateDoctor/{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult UpdateDoctor(int id, [FromBody] User updatedDoctor)
        {
            try
            {
                var existingDoctor = _authContext.Users.FirstOrDefault(u => u.Id == id && u.Category != null);

                if (existingDoctor == null)
                {
                    return NotFound();
                }

                // Update properties of the existingDoctor with properties of updatedDoctor
                existingDoctor.FirstName = updatedDoctor.FirstName;
                existingDoctor.LastName = updatedDoctor.LastName;
                existingDoctor.Category = updatedDoctor.Category;

                _authContext.SaveChanges();

                return Ok(existingDoctor);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(500, new { Message = "Internal Server Error" });
            }
        }


        [HttpDelete("deleteDoctor/{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult DeleteDoctor(int id)
        {
            try
            {
                var doctorToDelete = _authContext.Users.FirstOrDefault(u => u.Id == id && u.Category != null);

                if (doctorToDelete == null)
                {
                    return NotFound();
                }

                _authContext.Users.Remove(doctorToDelete);
                _authContext.SaveChanges();

                return Ok(new { Message = "Doctor deleted successfully" });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(500, new { Message = "Internal Server Error" });
            }
        }


        [HttpGet("getUser")]
        public IActionResult GetUsers()
        {
            try
            {
                var users = _authContext.Users.ToList();
                return Ok(users);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);

                return StatusCode(500, new { Message = "Internal Server Error" });
            }
        }

        [HttpGet("getUser/{id}")]
        public IActionResult GetUserById(int id)
        {
            try
            {
                var user = _authContext.Users.FirstOrDefault(u => u.Id == id);

                if (user == null)
                {
                    return NotFound();
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(500, new { Message = "Internal Server Error" });
            }
        }

        [HttpGet("getClientByIdNumber")]
        public IActionResult getClientByIdNumber(string IdNumber)
        {
            try
            {
                var client = _authContext.Users.FirstOrDefault(u => u.IdNumber == IdNumber );

                if (client == null)
                {
                    return NotFound();
                }

                return Ok(client);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(500, new { Message = "Internal Server Error" });
            }
        }

        [HttpGet("send-code/{email}")]
        public async Task<IActionResult> SendActivationCode(string email)
        {
            try
            {
                if (await CheckEmailExistAsync(email))
                {
                    return BadRequest(new { Message = "მეილი უკვე რეგისტრირებულია!" });
                }

                var existingActivationCode = await _authContext.ActivationCodes.FirstOrDefaultAsync(ac => ac.Email == email && !ac.Used);

                if (existingActivationCode != null)
                {
                    // Mark the existing activation code as used
                    existingActivationCode.Used = true;
                    _authContext.Update(existingActivationCode);
                    await _authContext.SaveChangesAsync();
                }

                if (!string.IsNullOrEmpty(email))
                {
                    var activationCode = await _activationCodeService.GenerateActivationCodeAsync();
                    /*globalActivationCode = activationCode;*/
                    activationCodeExpirationTime = DateTime.Now.AddMinutes(2); 



                    var subject = "აქტივაციის კოდი";
                    var body = $@"
                            <html>
                                <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333;'>
                                    <div style='max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'>
                                        <h1 style='color: #3498db;'>{subject}</h1>
                                        <p>ძვირფასო მომხმარებელო,</p>
                                        <p>მადლობას გიხდით ჩვენი კომპანიის სერვისით სარგებლობისთვის</p>
                                        <p>თქვენი აქტივაციის კოდი არის:</p>
                                        <div style='background-color: #3498db; color: #fff; padding: 10px; border-radius: 5px; font-size: 18px; font-weight: bold;'>{activationCode}</div>
                                        <p>გთხოვთ ფრთხილად იყავით, თქვენი კოდი არ გაუზიაროთ სხვას.</p>
                                        <p>წარმატებებს გისურვებთ ვლადიმერი!</p>
                                    </div>
                                </body>
                            </html>
                        ";

                    await _activationCodeService.SendActivationCodeAsync(email, activationCode, body, subject);

                    return Ok(new { Message = "აქტივაციის კოდი გაიგზავნა წარმატებით!" });
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it based on your application's error handling strategy
                return StatusCode(500, new { Message = "Error sending activation code", Error = ex.Message });
            }
        }


        [HttpGet("send-reset-code/{email}")]
        public async Task<IActionResult> SendResetCode(string email)
        {
            try
            {
                if (!string.IsNullOrEmpty(email))
                {

                    var resetCode = await _passwordResetService.GenerateResetCodeAsync();

                    // Update the user's password in the database without hashing
                    var user = _authContext.Users.FirstOrDefault(u => u.Email == email);
                    if (user != null)
                    {
                        user.Password = resetCode;
                        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(resetCode);
                        _authContext.SaveChanges();
                    }

                    if (user.Role == "admin")
                    {
                        return BadRequest(new { Message = "ადმინის პაროლის ცვლილება შეუძლებელია!" });
                    }


                    // Customize the email subject and body as needed
                    var name = user?.FirstName;
                    var subject = "პაროლის აღდგენა";
                    var body = $@"<html>
               <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333;'>
                                    <div style='max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'>
                                        <h1 style='color: #3498db;'>{subject}</h1>
                                        <p>ძვირფასო <strong>{name}</strong>,</p>
                                        <p>მადლობას გიხდით ჩვენი კომპანიის სერვისით სარგებლობისთვის</p>
                                        <p>თქვენი ახალი პაროლი არის:</p>
                                        <div style='background-color: #3498db; color: #fff; padding: 10px; border-radius: 5px; font-size: 18px; font-weight: bold;'>{user.Password}</div>
                                        <p>თქვენი კოდი არ გაუზიაროთ სხვას.</p> <hr>
                                        <h4>გთხოვთ გადადით გვერდზე და გაიარეთ ავტორიზაცია. 😊😊😊</h4>
                                        <hr>
                                        <h5>წარმატებებს გისურვებთ ვლადიმერი!</h5>
                                    </div>

                </body>
              </html>";
                    
                    await _passwordResetService.SendResetCodeAsync(email, resetCode, body, subject);

                    // Return the reset code to the client if needed
                    return Ok(new { Message = "ახალი პაროლი გაიგზავნა მეილზე - ", ResetCode = resetCode });
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it based on your application's error handling strategy
                Console.Error.WriteLine(ex);
                return StatusCode(500, new { Message = "პარალოს გაგზავნისას მოხდა შეცდომა!", Error = ex.Message });
            }
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] PasswordChangeRequest passwordChangeRequest)
        {
            try
            {
                var user = await _authContext.Users.FirstOrDefaultAsync(u => u.Email == passwordChangeRequest.Email);

                if (user == null)
                {
                    return BadRequest(new { Message = "მომხმარებელი არ მოიძებნა!" });
                }

                // Check if the provided old password matches the stored password hash
                if (!BCrypt.Net.BCrypt.Verify(passwordChangeRequest.OldPassword, user.PasswordHash))
                {
                    return BadRequest(new { Message = "ძველი პაროლი არასწორია!" });
                }

                // Check the strength of the new password
                var passMessage = CheckPasswordStrength(passwordChangeRequest.NewPassword);
                if (!string.IsNullOrEmpty(passMessage))
                {
                    return BadRequest(new { Message = passMessage });
                }

                // Update the user's password
                user.Password = passwordChangeRequest.NewPassword;
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(passwordChangeRequest.NewPassword);

                // Save changes to the database
                await _authContext.SaveChangesAsync();

                return Ok(new { Message = "პაროლი შეცვლილია!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "პაროლის ცვლილების დროს მოხდა შეცდომა!", Error = ex.Message });
            }
        }

    }


}
