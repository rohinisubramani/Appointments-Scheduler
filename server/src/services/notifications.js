export async function sendSms(toPhone, message) {
  const provider = process.env.SMS_PROVIDER || 'console';
  if (provider === 'console') {
    console.log(`[SMS] to ${toPhone}: ${message}`);
    return true;
  }
  if (provider === 'twilio') {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM_NUMBER;
    if (!sid || !token || !from) return false;
    const { default: Twilio } = await import('twilio');
    const client = Twilio(sid, token);
    await client.messages.create({ body: message, from, to: toPhone });
    return true;
  }
  return false;
}
