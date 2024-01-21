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


        public UserController(AppDbContext context, IActivationCodeService activationCodeService, IPasswordResetService passwordResetService)
        {
            _authContext = context;
            _activationCodeService = activationCodeService;
            _passwordResetService = passwordResetService;

            if (!_authContext.Users.Any(user => user.Category != null))
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
                LastName = "User",
                Password = BCrypt.Net.BCrypt.HashPassword("admin"),
                IdNumber = "00000000000", // Adjust as needed
                Category = null,
                starNum = 0,
                Email = "admin", // Adjust as needed
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
            new User { FirstName = "გიორგი", LastName = "ხორავა", Password = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000001", Category = "ანდროლოგი",starNum = 5, Email = "1@gmail.com", Role = "doctor", ImageUrl = "/assets/image1.jpg", IsAdmin = false},
            new User { FirstName = "ნატალია", LastName = "გოგოხია", Password = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000002", Category = "ანესთეზიოლოგი", starNum = 3, Email = "2@gmail.com", Role = "doctor", ImageUrl = "/assets/image2.jpg", IsAdmin = false },
            new User { FirstName = "ანა", LastName = "დვლაი",Password = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000003", Category = "კარდიოლოგი", starNum = 4, Email = "3@gmail.com", Role = "doctor", ImageUrl = "/assets/image3.jpg", IsAdmin = false },
            new User { FirstName = "გიორგი", LastName = "გაბიტაშვილი", Password = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000004", Category = "კოსმეტოლოგი", starNum = 5, Email = "4@gmail.com", Role = "doctor", ImageUrl = "/assets/image4.jpg", IsAdmin = false },
            new User { FirstName = "ბარბარე", LastName = "ქორთუა", Password = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000005", Category = "ლაბორანტი", starNum = 3, Email = "5@gmail.com", Role = "doctor", ImageUrl = "/assets/image5.jpg", IsAdmin = false },
            new User { FirstName = "გიორგი", LastName = "ხორავა", Password = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000006", Category = "პედიატრი", starNum = 3, Email = "6@gmail.com", Role = "doctor", ImageUrl = "/assets/image6.jpg", IsAdmin = false },
            new User { FirstName = "ნატალია", LastName = "გაბიტაშვილი", Password = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000007", Category = "ოჯახის ექიმი", starNum = 5, Email = "7@gmail.com", Role = "doctor", ImageUrl = "/assets/image7.jpg", IsAdmin = false },
            new User { FirstName = "გიორგი", LastName = "დვალი", Password = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000008", Category = "ტოქსიკოლოგი", starNum = 2, Email = "8@gmail.com", Role = "doctor", ImageUrl = "/assets/image8.jpg", IsAdmin = false },
            new User { FirstName = "ანა", LastName = "გაბიტაშვილი", Password = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000009", Category = "ტრანსფუზილოგი", starNum = 5, Email = "9@gmail.com", Role = "doctor", ImageUrl = "/assets/image9.jpg", IsAdmin = false },
            new User { FirstName = "დავით", LastName = "გიუნაშვილი", Password = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000010", Category = "ოჯახის ექიმი", starNum = 4, Email = "10@gmail.com", Role = "doctor", ImageUrl = "/assets/image9.jpg", IsAdmin = false },
            new User { FirstName = "ზურაბ", LastName = "ანთაძე", Password = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="00000000011", Category = "თერაპევტი", starNum = 3, Email = "11@gmail.com", Role = "doctor", ImageUrl = "/assets/image9.jpg", IsAdmin = false },
            new User { FirstName = "ვაკო", LastName = "ჯანიკა", Password = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="10000000001", Email = "vako@gmail.com", Role = "client", ImageUrl = "/assets/image3.jpg", IsAdmin = false },
            new User { FirstName = "დავით", LastName = "გიუნა", Password = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="10000000002", Email = "davit@gmail.com", Role = "client", ImageUrl = "/assets/image3.jpg", IsAdmin = false },
            new User { FirstName = "გიროგი", LastName = "გიორგაძე", Password = BCrypt.Net.BCrypt.HashPassword("123456"), IdNumber="10000000003", Email = "giorgi@gmail.com", Role = "client", ImageUrl = "/assets/image3.jpg", IsAdmin = false },

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
                return BadRequest(new { Message = "This is not valid" });
            }

            // check email
            if (await CheckEmailExistAsync(userObj.Email))
                return BadRequest(new { Message = "Email Already Exist" });

            //check username
            if (await CheckIdNumberExistAsync(userObj.IdNumber))
                return BadRequest(new { Message = "Idnumber Already Exist" });

            if (userObj.activationcode != globalActivationCode)
                return BadRequest(new { Message = "Activation Code is In Valid" });

            /*var passMessage = CheckPasswordStrength(userObj.Password);
            if (!string.IsNullOrEmpty(passMessage))
                return BadRequest(new { Message = passMessage.ToString() });*/
            userObj.Role = "client";
            userObj.Password = BCrypt.Net.BCrypt.HashPassword(userObj.Password);

            await _authContext.AddAsync(userObj);
            await _authContext.SaveChangesAsync();

            return Ok(new
            {
                Status = 200,
                Message = "User Added!"
            });
        }

        /*[HttpPost("AuthenticateUser")]
        public IActionResult AuthenticateUser([FromBody] User userObj)
        {
            try
            {
                if (userObj.Email == null || userObj.Password == null)
                {
                    return BadRequest(new { message = "Null data" });
                }

                // Check if the provided credentials match the default admin credentials
                if (userObj.Email == "admin" && userObj.Password == "admin")
                {

                    var adminUser = new User { Email = "admin", IsAdmin = true, Role = "admin" };
                    return Ok(new
                    {
                        Message = "true",
                        User = adminUser
                    });
                }

                // Check if the provided credentials match the default admin credentials
                var users = _authContext.Users.Where(x => x.Email.ToLower() == userObj.Email.ToLower() && x.Password.ToLower() == userObj.Password.ToLower()).FirstOrDefault();

                if (users == null)
                {
                    return BadRequest();
                }

                if (users.Category != null)
                {
                    var doctorUser = _authContext.Users
                        .Where(x => x.Email.ToLower() == userObj.Email.ToLower() && x.Password.ToLower() == userObj.Password.ToLower())
                        .FirstOrDefault();

                    return Ok(new
                    {
                        Message = "doctor login",
                        User = doctorUser
                    });
                }

                return Ok(new
                {
                    Message = "client login",
                    User = users
                });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);

                // Return an error response
                return StatusCode(500, new { Message = "Internal Server Error" });
            }
        }*/

        [HttpPost("doctor-register")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AddDoctor([FromBody] User userObj)
        {
            if (userObj == null)
                return BadRequest();
            if (string.IsNullOrEmpty(userObj.Email) || string.IsNullOrEmpty(userObj.Password) || string.IsNullOrEmpty(userObj.Category) || string.IsNullOrEmpty(userObj.Password) || string.IsNullOrEmpty(userObj.FirstName) || string.IsNullOrEmpty(userObj.LastName) || string.IsNullOrEmpty(userObj.IdNumber))
                return BadRequest(new { Message = "Please Fill All Records" });


            if (await CheckEmailExistAsync(userObj.Email))
                return BadRequest(new { Message = "Email Already Exist" });

            //check username
            if (await CheckIdNumberExistAsync(userObj.IdNumber))
                return BadRequest(new { Message = "Idnumber Already Exist" });

            userObj.Role = "doctor";
            userObj.Password = BCrypt.Net.BCrypt.HashPassword(userObj.Password);
            await _authContext.AddAsync(userObj);
            await _authContext.SaveChangesAsync();

            return Ok(new
            {
                Status = 200,
                Message = $"{userObj.Role} is Added!"
            });
        }


        private async Task<bool> CheckEmailExistAsync(string? email)
            => await _authContext.Users.AnyAsync(x => x.Email.Equals(email));


        private Task<bool> CheckIdNumberExistAsync(string? idnumber)
            => _authContext.Users.AnyAsync(x => x.IdNumber == idnumber);


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
                // Log the exception
                Console.Error.WriteLine(ex);

                // Return an error response
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
                existingDoctor.Email = updatedDoctor.Email;
                existingDoctor.IdNumber = updatedDoctor.IdNumber;
                existingDoctor.Password = updatedDoctor.Password;
                existingDoctor.Category = updatedDoctor.Category;
                existingDoctor.ImageUrl = updatedDoctor.ImageUrl;

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
                // Log the exception
                Console.Error.WriteLine(ex);

                // Return an error response
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

        [HttpGet("send-code/{email}")]
        public async Task<IActionResult> SendActivationCode(string email)
        {
            try
            {
                if (!string.IsNullOrEmpty(email))
                {
                    var activationCode = await _activationCodeService.GenerateActivationCodeAsync();
                    globalActivationCode = activationCode;

                    // Customize the email subject and body as needed
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

                    return Ok(new { Message = "Activation code sent successfully" });
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
                        user.Password = resetCode; // Assuming resetCode is the new password
                        _authContext.SaveChanges();
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
                                        <div style='background-color: #3498db; color: #fff; padding: 10px; border-radius: 5px; font-size: 18px; font-weight: bold;'>{resetCode}</div>
                                        <p>თქვენი კოდი არ გაუზიაროთ სხვას.</p> <hr>
                                        <h4>გთხოვთ გადადით გვერდზე და გაიარეთ ავტორიზაცია. 😊😊😊</h4>
                                        <hr>
                                        <h5>წარმატებებს გისურვებთ ვლადიმერი!</h5>
                                    </div>

                </body>
              </html>";

                    await _passwordResetService.SendResetCodeAsync(email, resetCode, body, subject);

                    // Return the reset code to the client if needed
                    return Ok(new { Message = "Password reset code sent successfully", ResetCode = resetCode });
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
                return StatusCode(500, new { Message = "Error sending password reset code", Error = ex.Message });
            }
        }

    }


}
