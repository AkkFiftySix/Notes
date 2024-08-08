using Logic.Models;
using Microsoft.AspNetCore.Mvc;
using NotesBack.Common;

namespace NotesBack.Controllers;

public class BaseController : ControllerBase
{
    protected int UserId
    {
        get
        {
            return HttpContext.GetIntValueFromClaim(CustomClaims.UserId);
        }
    }
}
