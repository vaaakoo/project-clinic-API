﻿using AngularAuthYtAPI.Models;
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
using AngularAuthApi.Migrations;

namespace AngularAuthYtAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        private static string globalActivationCode = string.Empty;
        private readonly IActivationCodeService _activationCodeService;

        public UserController(AppDbContext context, IActivationCodeService activationCodeService)
        {
            _authContext = context;
            _activationCodeService = activationCodeService;

            if (!_authContext.Users.Any(user => user.Category != null))
            {
                SeedInitialData();
            }
        }

        private void SeedInitialData()
        {
            var initialDoctors = new List<User>
        {
            new User { FirstName = "giorgi", LastName = "xorava", Password = "123456", Category = "ანდროლოგი", Email = "1@gmail.com", Role = "doctor", ImageUrl = "/assets/image1.jpg", IsAdmin = false},
            new User { FirstName = "natalia", LastName = "gogoxia", Password = "123456", Category = "ანესთეზიოლოგი", Email = "2@gmail.com", Role = "doctor", ImageUrl = "/assets/image2.jpg", IsAdmin = false },
            new User { FirstName = "ana", LastName = "dvali",Password = "123456", Category = "კარდიოლოგი", Email = "3@gmail.com", Role = "doctor", ImageUrl = "/assets/image3.jpg", IsAdmin = false },
            new User { FirstName = "giorgi", LastName = "gabitashvili", Password = "123456", Category = "კოსმეტოლოგი", Email = "4@gmail.com", Role = "doctor", ImageUrl = "/assets/image4.jpg", IsAdmin = false },
            new User { FirstName = "barbare", LastName = "qorTua", Password = "123456", Category = "ლაბორანტი", Email = "5@gmail.com", Role = "doctor", ImageUrl = "/assets/image5.jpg", IsAdmin = false },
            new User { FirstName = "giorgi", LastName = "xaranauli", Password = "123456", Category = "პედიატრი", Email = "6@gmail.com", Role = "doctor", ImageUrl = "/assets/image6.jpg", IsAdmin = false },
            new User { FirstName = "natia", LastName = "gvilia", Password = "123456", Category = "ოჯახის ექიმი", Email = "7@gmail.com", Role = "doctor", ImageUrl = "/assets/image7.jpg", IsAdmin = false },
            new User { FirstName = "daviT", LastName = "dvali", Password = "123456", Category = "ტოქსიკოლოგი", Email = "8@gmail.com", Role = "doctor", ImageUrl = "/assets/image8.jpg", IsAdmin = false },
            new User { FirstName = "mariam", LastName = "gobejiani", Password = "123456", Category = "ტრანსფუზილოგი", Email = "9@gmail.com", Role = "doctor", ImageUrl = "/assets/image9.jpg", IsAdmin = false },
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
            await _authContext.AddAsync(userObj);
            await _authContext.SaveChangesAsync();

            return Ok(new
            {
                Status = 200,
                Message = "User Added!"
            });
        }


        [HttpPost("doctor-register")]
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


        [HttpPost("AuthenticateUser")]
        public IActionResult AuthenticateUser([FromBody] User userObj)
        {
            try
            {
                if(userObj.Email==null || userObj.Password == null)
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
                var users = _authContext.Users.Where(x=>x.Email.ToLower()== userObj.Email.ToLower() && x.Password.ToLower()== userObj.Password.ToLower()).FirstOrDefault();

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

        [HttpPost("upload"), DisableRequestSizeLimit]
        public IActionResult Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
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
                    var subject = "Activation Code";
                    var body = $"Your Activation Code is: {activationCode}";

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



    }


}