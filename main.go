package main

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

var DB *gorm.DB

func main() {
	_ = godotenv.Load(".env", ".env.local")

	DB = InitDatabase()

	app := fiber.New()

	app.Use(logger.New())

	api := app.Group("/api")

	api.Get("/all", func(ctx *fiber.Ctx) error {
		var b []Entry

		r := DB.Find(&b)
		if r.Error != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON("Internal Error")
		}

		var out []JSONEntry

		for i := 0; i < len(b); i++ {
			out = append(out, JSONEntry{
				ID:           b[i].ID,
				Description:  b[i].Description,
				CreationDate: b[i].CreationDate,
				MeetingID:    b[i].MeetingID,
				Passcode:     b[i].Passcode,
			})
		}

		return ctx.Status(fiber.StatusOK).JSON(out)
	})

	api.Post("/create", func(ctx *fiber.Ctx) error {
		var input JSONCreateEntry

		if err := ctx.BodyParser(&input); err != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
		}

		r := DB.Create(&Entry{
			Description:  input.Description,
			CreationDate: time.Now().Unix(),
			MeetingID:    input.MeetingID,
			Passcode:     input.Passcode,
			PasscodeHash: input.PasscodeHash,
		})

		if r.Error != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON("Invalid parameters")
		}

		return ctx.Status(fiber.StatusOK).JSON("Created")
	})

	api.Patch("/edit", func(ctx *fiber.Ctx) error {
		var input JSONEditEntry

		if err := ctx.BodyParser(&input); err != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
		}

		r := DB.Model(&Entry{ID: input.ID}).Updates(&Entry{
			Description:  input.Description,
			MeetingID:    input.MeetingID,
			Passcode:     input.Passcode,
			PasscodeHash: input.PasscodeHash,
		})

		if r.Error != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON("Invalid request")
		}

		return ctx.Status(fiber.StatusOK).JSON("Modified")
	})

	api.Post("/delete", func(ctx *fiber.Ctx) error {
		var input JSONDeleteEntry

		if err := ctx.BodyParser(&input); err != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON(err.Error())
		}

		r := DB.Delete(&Entry{
			ID: input.ID,
		})

		if r.Error != nil {
			return ctx.Status(fiber.StatusBadRequest).JSON("Invalid ID")
		}

		return ctx.Status(fiber.StatusOK).JSON("Deleted")
	})

	app.Static("/", "./frontend/build")
	app.Static("*", "./frontend/build/index.html")

	log.Println(os.Getenv("ZLS_HOST"))
	log.Println(string(os.Getenv("ZLS_HOST")) + ":" + string(os.Getenv("ZLS_PORT")))

	log.Fatal(app.Listen(string(os.Getenv("ZLS_HOST")) + ":" + string(os.Getenv("ZLS_PORT"))))
}
