const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    let htmlString = nodemMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'vsvijju987@gmail.com', // sender address
        to: comment.user.email,
        subject: "New Comment Published", // Subject line
        html: htmlString
    }, (err, info) => {
        if(err){
            console.log("Error in sending mail", err);
            return;
        }
        console.log("Message sent", info);
        return;
    });
}