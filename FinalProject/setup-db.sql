-- CREATE DATABASE IF NOT EXISTS commercedb;
-- USE commercedb;

DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS faqs;

CREATE TABLE products(
    pid         INT PRIMARY KEY AUTO_INCREMENT,
    title       VARCHAR(255) NOT NULL,
    image_name  VARCHAR(255) NOT NULL,
    category    VARCHAR(255) NOT NULL,
    last_sold   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    stock       INT NOT NULL
);

CREATE TABLE cart(
    pid         INT PRIMARY KEY AUTO_INCREMENT,
    quantity    INT NOT NULL,
    FOREIGN KEY (pid) REFERENCES products(pid) 
);

CREATE TABLE feedback(
    feedback_id     INT PRIMARY KEY AUTO_INCREMENT,
    name    VARCHAR(255) NOT NULL,
    email   VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL
);

CREATE TABLE faqs(
    faq_id      INT PRIMARY KEY AUTO_INCREMENT,
    question    TEXT NOT NULL,
    answer      TEXT NOT NULL
);


INSERT INTO products(title, image_name, category, stock) VALUES 
    ("League of Legends $10 Gift Card", "lol10.jpg", "League of Legends", 10),
    ("League of Legends $25 Gift Card", "lol25.jpg", "League of Legends", 20),
    ("League of Legends $50 Gift Card", "lol50.jpg", "League of Legends", 30),
    ("League of Legends $100 Gift Card", "lol100.jpg", "League of Legends", 40),
    ("Valorant $10 Gift Card", "valorant10.jpg", "Valorant", 50),
    ("Valorant $25 Gift Card", "valorant25.jpg", "Valorant", 60),
    ("Valorant $50 Gift Card", "valorant50.jpg", "Valorant", 70),
    ("Valorant $100 Gift Card", "valorant100.jpg", "Valorant", 80),
    ("Crunchyroll $25 Gift Card", "crunchyroll25.jpg", "Crunchyroll", 90),
    ("Hulu $25 Gift Card", "hulu25.jpg", "Hulu", 100),
    ("Hulu $50 Gift Card", "hulu50.jpg", "Hulu", 110),
    ("Hulu $100 Gift Card", "hulu100.jpg", "Hulu", 120),
    ("Netflix $15 Gift Card", "netflix15.jpg", "Netflix", 130),
    ("Netflix $30 Gift Card", "netflix30.jpg", "Netflix", 140),
    ("Netflix $50 Gift Card", "netflix50.jpg", "Netflix", 150);

INSERT INTO faqs(question, answer) VALUES
    ("How long did it take to make this e-commerce site?", "Though people often like to say Rome wasn't built in a day, this final project proposal was indeed built in a single day. It was quite the grind if I do say so myself."),
    ("It's been 10 days, why haven't my items shipped to me?", "Great observation! So the issue is this e-commerce store doesn't actually handle payment and shipping which means your purchase was actually a phantom transaction and you will never actually receive the goods you ordered. On the bright side, you didn't actually pay any money so I'd say all's well that ends well."),
    ("How long would it take me to make a site as beautiful as this?", "The process is quite simple really- get into Caltech, take CS 132, and in six short weeks, you'll be ready to built sites like this one."),
    ("Are there any other sites I should check out?", "Visit qup.gg and sign up to be among our first batch of beta testers!"),
    ("How did you make these super aesthetic gradients, Ajay?", "Figma magic, baby."),
    ("Any cool life hacks you know?", "When in doubt, drink water.");