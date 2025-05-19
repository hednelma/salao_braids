const email = require('nodemailer')
require('dotenv/config')

module.exports = {

    enviarEmail: async (user) => {
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
            subject: 'Bem-vindo ao salão braids!',
            html:
                `
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #ECF2F5;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #fff; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #fbde89;">Bem-vindo(a) ao salão braids!</h2>
                    <p>Olá, <strong>${user.nome}</strong>,</p>
                    <p>Seja bem-vindo(a) ao salão braids! Esta aplicacao podes fazer agendamentos das suas tranças, </p>
                    <h3 style="color: #fbde89;">O que você precisa saber:</h3>
                    <ul style="padding-left: 20px;">
                    <li>
                        <strong>Acesso:</strong> Você poderá acessar usando:
                        <ul style="padding-left: 20px;">
                            <li style="color: #fbde89; text-decoration: none;">Nome de utilizador: ${user.nomeutilizador}</li>
                            <li style="text-decoration: none;">A sua senha é a mesma que você usou para se registrar</li>.   
                        </ul>
                    </li>
                    <li>
                        <strong>Suporte:</strong> Para qualquer dúvida ou necessidade, nossa equipe está disponível através do e-mail 
                        <a href="mailto:salaobraids17@gmail.com" style="color: #fbde89; text-decoration: none;">salaobraids17@gmail.com</a>
                    </li>
                    </ul>
                    <p>Estamos aqui para apoiar você em sua jornada na <strong>salão braids</strong>! Seja muito bem-vindo(a) a essa nova experiência.</p>
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