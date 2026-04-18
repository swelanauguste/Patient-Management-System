import random

from django.core.management.base import BaseCommand
from django.db import transaction
from patients.models import PatientRecord

FIRST_NAMES = [
    "Ava",
    "Liam",
    "Noah",
    "Emma",
    "Olivia",
    "Sophia",
    "Mia",
    "Lucas",
    "Ethan",
    "Amelia",
    "Isabella",
    "Mason",
    "Logan",
    "Harper",
    "Evelyn",
    "Ella",
    "James",
    "Benjamin",
    "Henry",
    "Charlotte",
]
MIDDLE_NAMES = [
    None,
    None,
    None,  # increase chance of null/blank
    "Marie",
    "James",
    "Lee",
    "Grace",
    "Ray",
    "Ann",
    "Jude",
    "Kai",
    "Rose",
    "Quinn",
]
LAST_NAMES = [
    "Smith",
    "Johnson",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
    "Thompson",
    "Garcia",
    "Martinez",
    "Robinson",
    "Clark",
    "Lewis",
]


class Command(BaseCommand):
    help = "Seed the database with demo PatientRecord rows."

    def add_arguments(self, parser):
        parser.add_argument(
            "--count",
            type=int,
            default=20,
            help="How many patient records to create (default: 20).",
        )
        parser.add_argument(
            "--min-age",
            type=int,
            default=1,
            help="Minimum age (default: 1).",
        )
        parser.add_argument(
            "--max-age",
            type=int,
            default=120,
            help="Maximum age (default: 120).",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete all existing PatientRecord rows before seeding.",
        )
        parser.add_argument(
            "--seed",
            type=int,
            default=None,
            help="Random seed for repeatable output.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        count = options["count"]
        min_age = options["min_age"]
        max_age = options["max_age"]
        clear = options["clear"]
        seed = options["seed"]

        if seed is not None:
            random.seed(seed)

        if count < 1:
            self.stdout.write(self.style.WARNING("Nothing to do: --count must be >= 1"))
            return

        if min_age < 0 or max_age < 0 or max_age < min_age:
            raise ValueError("--min-age/--max-age are invalid")

        if clear:
            deleted, _ = PatientRecord.objects.all().delete()
            self.stdout.write(
                self.style.WARNING(f"Cleared PatientRecord: deleted {deleted} rows")
            )

        created = 0
        for _ in range(count):
            first_name = random.choice(FIRST_NAMES)
            middle_name = random.choice(MIDDLE_NAMES)
            last_name = random.choice(LAST_NAMES)

            gender = random.choice(["M", "F"])
            age = random.randint(min_age, max_age)

            # last_name is nullable in your model; occasionally set it null for variety
            if random.random() < 0.10:
                last_name_value = None
            else:
                last_name_value = last_name

            PatientRecord.objects.create(
                first_name=first_name,
                middle_name=middle_name,
                last_name=last_name_value,
                gender=gender,
                age=age,
            )
            created += 1

        self.stdout.write(
            self.style.SUCCESS(f"Created {created} PatientRecord row(s).")
        )
