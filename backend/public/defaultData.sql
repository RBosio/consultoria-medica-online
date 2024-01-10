INSERT INTO country (name) VALUES ('Argentina');
INSERT INTO country (name) VALUES ('Brasil');

INSERT INTO province (name, countryId) VALUES ('Santa Fe', 1);
INSERT INTO province (name, countryId) VALUES ('Buenos Aires', 1);

INSERT INTO city (zipCode, name, provinceId) VALUES ('1000', 'Buenos Aires', 2);
INSERT INTO city (zipCode, name, provinceId) VALUES ('2000', 'Rosario', 1);
INSERT INTO city (zipCode, name, provinceId) VALUES ('3000', 'Santa Fe', 1);

INSERT INTO speciality (name) VALUES ('Psicologia');
INSERT INTO speciality (name) VALUES ('Cardiologia');

INSERT INTO health_insurance (name, discount) VALUES ('OSDE', 0.30);

INSERT INTO plan (name, price) VALUES ('Plan 1', 12000);
INSERT INTO plan (name, price) VALUES ('Plan 2', 20000);

INSERT INTO schedule (day, start_hour, end_hour, doctorId) VALUES (0, 14, 18, 1);
INSERT INTO schedule (day, start_hour, end_hour, doctorId) VALUES (1, 14, 18, 1);
INSERT INTO schedule (day, start_hour, end_hour, doctorId) VALUES (2, 14, 18, 1);
INSERT INTO schedule (day, start_hour, end_hour, doctorId) VALUES (3, 14, 18, 1);
INSERT INTO schedule (day, start_hour, end_hour, doctorId) VALUES (4, 14, 18, 1);
INSERT INTO schedule (day, start_hour, end_hour, doctorId) VALUES (5, 9, 12, 1);
INSERT INTO schedule (day, start_hour, end_hour, doctorId) VALUES (5, 14, 18, 1);
INSERT INTO schedule (day, start_hour, end_hour, doctorId) VALUES (6, 14, 18, 1);

INSERT INTO medical_record (datetime, detail) VALUES ("2024-01-20T20:00:00", "Detalle");

INSERT INTO meeting (userId, startDatetime, doctorId, medicalRecordDatetime, specialityId) VALUES (1, "2024-01-15T14:00:00", 1, "2024-01-20T20:00:00", 1);
INSERT INTO meeting (userId, startDatetime, doctorId, specialityId) VALUES (1, "2024-01-17T09:30:00", 1, 2);

INSERT INTO comment (datetime, meetingUserId, meetingStartDatetime, comment, userCommentId) VALUES ("2024-01-15T14:32:48", 1, "2024-01-17T09:30:00", "Comentario 1", 1);
INSERT INTO comment (datetime, meetingUserId, meetingStartDatetime, comment, userCommentId) VALUES ("2024-01-15T15:14:26", 1, "2024-01-17T09:30:00", "Comentario 2", 2);