const email = require('nodemailer')
require('dotenv/config')

module.exports = {

    enviarEmail: async (user, hora, service, profissional) => {
        const transport = email.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSE
            }
        })

        transport.sendMail({
            from: `salão braids <${process.env.EMAIL}>`,
            to: user.email,
            subject: 'Lembrete de agendamento',
            html:
                `
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #ECF2F5;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #fff; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #fbde89;">Bem-vindo(a) ao salão braids!</h2>
                    <p>Olá, <strong>${user.nome}</strong>,</p>
                    <p>Enviamos este email para te lembrar de que tens um agendamento marcado para ${hora} com ${profissional.nome} para fazer  ${service.nome} no salão braids</p>
                    <div style="text-align: center; margin: 20px 0;">
                    </div>
                    <p>Atenciosamente,</p>
                    <p><strong>salão braids</strong></p>
                </div>
            </body>
            `
        })
            .then(() => { console.log("Email enviado com sucesso") })
            .catch((err) => { console.log("Erro ao enviar email: ", err) })
    }
}