namespace AngularAuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserService userService, IAuthService authService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> AddUser([FromBody] RegisterUserDto userObj)
        {
            if (userObj == null) return BadRequest();

            if (userObj.Email == "admin" && userObj.Password == "admin")
                return BadRequest(new { Message = "შეცდომაა!" });

            if (await userService.CheckEmailExistAsync(userObj.Email!))
                return BadRequest(new { Message = "ეს მეილი გამოყენებულია! გთხოვთ გაიაროთ ავტორიზაცია." });

            if (await userService.CheckIdNumberExistAsync(userObj.IdNumber!))
                return BadRequest(new { Message = "შეცდომა! პირადი ნომერი უნდა შეიცავდეს 11 ციფრს!" });

            var result = await userService.RegisterUserAsync(userObj);
            if (!result)
                return BadRequest(new { Message = "აქტივაციის კოდი არასწორია ან ვადაგასული!" });

            return Ok(new { Status = 200, Message = "რეგისტრაცია გავლილია!" });
        }

        [HttpPost("doctor-register")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AddDoctor([FromBody] RegisterDoctorDto userObj)
        {
            if (userObj == null) return BadRequest();

            if (await userService.CheckEmailExistAsync(userObj.Email!))
                return BadRequest(new { Message = "Email Already Exist" });

            if (await userService.CheckIdNumberExistAsync(userObj.IdNumber!))
                return BadRequest(new { Message = "Invalid or already existing ID number." });

            await userService.RegisterDoctorAsync(userObj);

            return Ok(new { Status = 200, Message = "Doctor is Added!" });
        }

        [HttpGet("getDoctor")]
        public async Task<IActionResult> GetDoctors()
        {
            var doctors = await userService.GetAllDoctorsAsync();
            return Ok(doctors);
        }

        [HttpGet("getDoctor/{id}")]
        public async Task<IActionResult> GetDoctorById(int id)
        {
            var doctor = await userService.GetDoctorByIdAsync(id);
            if (doctor == null) return NotFound();
            return Ok(doctor);
        }

        [HttpGet("getDoctorByIdNumber")]
        public async Task<IActionResult> GetDoctorByIdNumber(string IdNumber)
        {
            var doctor = await userService.GetDoctorByIdNumberAsync(IdNumber);
            if (doctor == null) return NotFound();
            return Ok(doctor);
        }

        [HttpPut("updateDoctor/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] UpdateDoctorDto updatedDoctor)
        {
            var result = await userService.UpdateDoctorAsync(id, updatedDoctor);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("deleteDoctor/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var result = await userService.DeleteDoctorAsync(id);
            if (!result) return NotFound();
            return Ok(new { Message = "Doctor deleted successfully" });
        }

        [HttpGet("getUser")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await userService.GetAllDoctorsAsync(); 
            return Ok(users);
        }

        [HttpGet("getUser/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await userService.GetUserByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpGet("getClientByIdNumber")]
        public async Task<IActionResult> GetClientByIdNumber(string IdNumber)
        {
            var client = await userService.GetClientByIdNumberAsync(IdNumber);
            if (client == null) return NotFound();
            return Ok(client);
        }

        [HttpGet("send-code/{email}")]
        public async Task<IActionResult> SendActivationCode(string email)
        {
            if (await userService.CheckEmailExistAsync(email))
                return BadRequest(new { Message = "მეილი უკვე რეგისტრირებულია!" });

            await authService.SendActivationCodeAsync(email);
            return Ok(new { Message = "აქტივაციის კოდი გაიგზავნა წარმატებით!" });
        }

        [HttpGet("send-reset-code/{email}")]
        public async Task<IActionResult> SendResetCode(string email)
        {
            await authService.SendResetCodeAsync(email);
            return Ok(new { Message = "ახალი პაროლი გაიგზავნა მეილზე" });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] PasswordChangeRequest request)
        {
            var result = await authService.ChangePasswordAsync(request);
            if (!result) return BadRequest(new { Message = "ძველი პაროლი არასწორია ან მომხმარებელი არ მოიძებნა!" });

            return Ok(new { Message = "პაროლი შეცვლილია!" });
        }
    }
}
