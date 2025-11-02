"""
Script to seed the database with example shortcuts
Run this after initializing the database to add default shortcuts
"""

import sys
import os

# Add parent directory to path to import models
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask
from src.models.user import db
from src.models.prompt import Shortcut
from datetime import datetime

# Example shortcuts inspired by Espanso and common productivity needs
EXAMPLE_SHORTCUTS = [
    {
        'trigger': ':email',
        'expansion': 'your@email.com',
        'description': 'Your email address',
        'is_active': True
    },
    {
        'trigger': ':phone',
        'expansion': '(555) 123-4567',
        'description': 'Your phone number',
        'is_active': True
    },
    {
        'trigger': ':addr',
        'expansion': '123 Main Street\nAnytown, ST 12345',
        'description': 'Your mailing address',
        'is_active': True
    },
    {
        'trigger': ':sig',
        'expansion': 'Best regards,\nYour Name\nYour Title',
        'description': 'Email signature',
        'is_active': True
    },
    {
        'trigger': '/date',
        'expansion': datetime.now().strftime('%Y-%m-%d'),
        'description': 'Current date (YYYY-MM-DD)',
        'is_active': True
    },
    {
        'trigger': '/time',
        'expansion': datetime.now().strftime('%H:%M:%S'),
        'description': 'Current time (HH:MM:SS)',
        'is_active': True
    },
    {
        'trigger': ':shrug',
        'expansion': '¯\\_(ツ)_/¯',
        'description': 'Shrug emoticon',
        'is_active': True
    },
    {
        'trigger': ':thanks',
        'expansion': 'Thank you for your time and consideration.',
        'description': 'Polite thank you',
        'is_active': True
    },
    {
        'trigger': ':meeting',
        'expansion': 'Hi team,\n\nJust a reminder that we have a meeting scheduled for today.\n\nBest regards',
        'description': 'Meeting reminder template',
        'is_active': True
    },
    {
        'trigger': ':hello',
        'expansion': 'Hello! How can I help you today?',
        'description': 'Friendly greeting',
        'is_active': True
    },
    {
        'trigger': ':br',
        'expansion': 'Best regards',
        'description': 'Email closing',
        'is_active': True
    },
    {
        'trigger': ':lgtm',
        'expansion': 'Looks good to me!',
        'description': 'Code review approval',
        'is_active': True
    }
]

def seed_shortcuts():
    """Add example shortcuts to the database"""
    
    # Create Flask app context
    app = Flask(__name__)
    
    # Get database path from environment or use default
    base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    database_path = os.path.join(base_dir, 'database', 'app.db')
    
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{database_path}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize database
    db.init_app(app)
    
    with app.app_context():
        print("Starting to seed shortcuts...")
        
        # Check if shortcuts already exist
        existing_count = Shortcut.query.count()
        if existing_count > 0:
            print(f"Database already has {existing_count} shortcuts.")
            response = input("Do you want to add more example shortcuts? (yes/no): ")
            if response.lower() not in ['yes', 'y']:
                print("Skipping shortcut seeding.")
                return
        
        added_count = 0
        skipped_count = 0
        
        for shortcut_data in EXAMPLE_SHORTCUTS:
            # Check if trigger already exists
            existing = Shortcut.query.filter_by(trigger=shortcut_data['trigger']).first()
            
            if existing:
                print(f"  ⚠ Skipping '{shortcut_data['trigger']}' - already exists")
                skipped_count += 1
                continue
            
            # Create new shortcut
            shortcut = Shortcut(
                trigger=shortcut_data['trigger'],
                expansion=shortcut_data['expansion'],
                description=shortcut_data['description'],
                is_active=shortcut_data['is_active']
            )
            
            db.session.add(shortcut)
            print(f"  ✓ Added '{shortcut_data['trigger']}' -> '{shortcut_data['expansion'][:30]}...'")
            added_count += 1
        
        # Commit all changes
        db.session.commit()
        
        print(f"\n✨ Shortcuts seeding complete!")
        print(f"   Added: {added_count}")
        print(f"   Skipped: {skipped_count}")
        print(f"   Total shortcuts in database: {Shortcut.query.count()}")

if __name__ == '__main__':
    seed_shortcuts()