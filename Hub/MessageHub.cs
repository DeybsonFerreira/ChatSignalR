using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ChatSignalR.Hubs
{
    public class MessageHub : Hub
    {
        public async Task SendMessage(JsonObjectHub jsonObject)
        {
            string jsonString = JsonSerializer.Serialize(jsonObject);
            await base.Clients.All.SendAsync("ReceiveMessage", jsonString);
        }
    }
    public class JsonObjectHub
    {
        public JsonObjectHub()
        {
            this.Date = DateTime.Now;
        }
        public string Username { get; set; }
        public string Message { get; set; }
        public Guid BrowserId { get; set; }
        public DateTime Date { get; set; }
    }
}