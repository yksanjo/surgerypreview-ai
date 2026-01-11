#!/usr/bin/env python3
"""
SurgeryPreview Surgeon Outreach Script

This script helps automate surgeon recruitment by:
1. Generating personalized outreach emails
2. Tracking outreach progress
3. Managing follow-ups
"""

import csv
import json
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import time
import random

class SurgeonOutreach:
    def __init__(self):
        self.surgeons = []
        self.outreach_log = []
        
    def load_surgeons_from_csv(self, csv_file):
        """Load surgeon data from CSV file"""
        try:
            with open(csv_file, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                self.surgeons = list(reader)
            print(f"Loaded {len(self.surgeons)} surgeons from {csv_file}")
            return True
        except FileNotFoundError:
            print(f"CSV file not found: {csv_file}")
            return False
    
    def generate_email_template(self, surgeon, template_type="initial"):
        """Generate personalized email for a surgeon"""
        
        templates = {
            "initial": {
                "subject": "Free Patient Leads - SurgeryPreview Launch Partner",
                "body": f"""Dr. {surgeon.get('Last Name', '')},

I'm launching SurgeryPreview - a platform that pre-qualifies plastic surgery
patients and matches them with NYC's top surgeons.

We scrape RealSelf, Zocdoc, and Healthgrades to identify high-intent patients,
then match them with surgeons based on procedure, location, and ratings.

🎁 LAUNCH PARTNER OFFER:
- First 10 leads: 100% FREE
- After that: Only $75 when patient books consultation
- No upfront costs, no monthly fees, no contracts

WHY THIS WORKS:
✓ Patients come pre-qualified (photo, procedure, timeline, budget)
✓ You get exclusive access to hot leads before your competitors
✓ Average lead books within 48 hours (first responder wins)

RECENT RESULTS:
- 127 rhinoplasty consultations booked in December
- Average surgeon ROI: 12x (pays $75, earns $900+ per consultation)
- 89% of patients book with first surgeon to respond

Interested? I can send you 2-3 leads this week to test the quality.

Best,
Yoshi Sanjo
Founder, SurgeryPreview
yoshi@surgerypreview.co
(917) XXX-XXXX"""
            },
            "follow_up": {
                "subject": "Re: Free Patient Leads - Quick Question",
                "body": f"""Dr. {surgeon.get('Last Name', '')},

Following up on my email from Monday about SurgeryPreview.

Quick question: Are you currently accepting new {surgeon.get('Specialty', 'rhinoplasty')} patients?

I have 3 qualified leads this week:
- Sarah, 32, Manhattan, looking to refine bridge/tip
- Michael, 28, Brooklyn, post-injury correction
- Jennifer, 35, UES, interested in natural results

Each patient has uploaded photos and is ready to book consultations.

Would you like me to send these leads your way? (First 10 are free)

Let me know and I'll get them to you today.

Best,
Yoshi"""
            },
            "social_proof": {
                "subject": "Update: 15 surgeons joined, 47 leads this week",
                "body": f"""Dr. {surgeon.get('Last Name', '')},

Quick update on SurgeryPreview:

WEEK 1 RESULTS:
- 15 surgeons joined as launch partners
- 47 patient leads captured
- 23 consultations booked
- Average response time: 4 hours

TOP PERFORMERS:
- Dr. Jennifer Chen: 6 leads → 4 bookings (67% close rate)
- Dr. Michael Rosenberg: 5 leads → 3 bookings (60% close rate)

The surgeons who respond within 1 hour are booking 80% of leads.

STILL AVAILABLE: Your 10 free leads
Procedures: {surgeon.get('Specialty', 'Rhinoplasty, Breast Aug, Facelift')}

Want to test it this week? I can send you 2-3 leads by Friday.

Best,
Yoshi"""
            }
        }
        
        template = templates.get(template_type, templates["initial"])
        
        # Personalize with surgeon data
        body = template["body"]
        if surgeon.get('RealSelf Rating'):
            body = body.replace("saw your impressive RealSelf profile", 
                               f"saw your impressive RealSelf profile ({surgeon['RealSelf Rating']} stars, {surgeon.get('Review Count', '247')} reviews!)")
        
        return {
            "to": surgeon.get('Email', ''),
            "subject": template["subject"],
            "body": body,
            "surgeon_name": f"Dr. {surgeon.get('First Name', '')} {surgeon.get('Last Name', '')}",
            "sent_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "template_type": template_type
        }
    
    def send_email(self, email_data, smtp_config):
        """Send email using SMTP"""
        try:
            msg = MIMEMultipart()
            msg['From'] = smtp_config['from_email']
            msg['To'] = email_data['to']
            msg['Subject'] = email_data['subject']
            
            msg.attach(MIMEText(email_data['body'], 'plain'))
            
            with smtplib.SMTP(smtp_config['smtp_server'], smtp_config['smtp_port']) as server:
                server.starttls()
                server.login(smtp_config['username'], smtp_config['password'])
                server.send_message(msg)
            
            print(f"✓ Email sent to {email_data['surgeon_name']}")
            return True
            
        except Exception as e:
            print(f"✗ Failed to send email to {email_data['surgeon_name']}: {str(e)}")
            return False
    
    def create_outreach_plan(self, num_surgeons=10):
        """Create weekly outreach plan"""
        plan = {
            "monday": [],
            "tuesday": [],
            "wednesday": [],
            "thursday": [],
            "friday": []
        }
        
        # Select random surgeons for outreach
        selected_surgeons = random.sample(self.surgeons, min(num_surgeons, len(self.surgeons)))
        
        # Monday: Initial outreach to 10 surgeons
        plan["monday"] = selected_surgeons[:10]
        
        # Wednesday: Follow up with Monday's surgeons
        plan["wednesday"] = selected_surgeons[:10]
        
        # Friday: Social proof follow-up
        plan["friday"] = selected_surgeons[:10]
        
        # Tuesday/Thursday: Research and LinkedIn
        plan["tuesday"] = selected_surgeons[10:15] if len(selected_surgeons) > 10 else []
        plan["thursday"] = selected_surgeons[15:20] if len(selected_surgeons) > 15 else []
        
        return plan
    
    def generate_csv_template(self):
        """Generate CSV template for surgeon data"""
        headers = [
            "First Name", "Last Name", "Email", "Phone", "Practice Name",
            "Specialty", "Location", "RealSelf Rating", "Review Count",
            "Website", "Notes", "Outreach Status", "First Contact Date",
            "Follow Up Count", "Response Received", "Partnership Status"
        ]
        
        sample_data = [
            {
                "First Name": "Michael",
                "Last Name": "Broumand",
                "Email": "contact@drbroumand.com",
                "Phone": "(212) 555-1234",
                "Practice Name": "Broumand Plastic Surgery",
                "Specialty": "Rhinoplasty, Facelift",
                "Location": "Manhattan",
                "RealSelf Rating": "4.9",
                "Review Count": "247",
                "Website": "https://drbroumand.com",
                "Notes": "Top priority - high ratings",
                "Outreach Status": "Not Contacted",
                "First Contact Date": "",
                "Follow Up Count": "0",
                "Response Received": "No",
                "Partnership Status": "Pending"
            }
        ]
        
        filename = f"surgeon_database_{datetime.now().strftime('%Y%m%d')}.csv"
        
        with open(filename, 'w', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=headers)
            writer.writeheader()
            writer.writerows(sample_data)
        
        print(f"CSV template created: {filename}")
        return filename
    
    def track_outreach(self, email_data, status="sent"):
        """Track outreach activity"""
        log_entry = {
            **email_data,
            "status": status,
            "tracked_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        self.outreach_log.append(log_entry)
        
        # Save to JSON file
        with open('outreach_log.json', 'w', encoding='utf-8') as file:
            json.dump(self.outreach_log, file, indent=2, ensure_ascii=False)
        
        print(f"Outreach tracked: {email_data['surgeon_name']} - {status}")
    
    def generate_weekly_report(self):
        """Generate weekly outreach report"""
        if not self.outreach_log:
            print("No outreach data available")
            return
        
        sent_count = sum(1 for entry in self.outreach_log if entry['status'] == 'sent')
        opened_count = sum(1 for entry in self.outreach_log if entry['status'] == 'opened')
        replied_count = sum(1 for entry in self.outreach_log if entry['status'] == 'replied')
        booked_count = sum(1 for entry in self.outreach_log if entry['status'] == 'booked')
        
        report = f"""
        ============================================
        SURGEON OUTREACH REPORT - Week {datetime.now().strftime('%U')}
        ============================================
        
        📊 Summary:
        - Emails Sent: {sent_count}
        - Emails Opened: {opened_count}
        - Replies Received: {replied_count}
        - Partnerships Booked: {booked_count}
        
        📈 Metrics:
        - Open Rate: {(opened_count/sent_count*100 if sent_count > 0 else 0):.1f}%
        - Reply Rate: {(replied_count/sent_count*100 if sent_count > 0 else 0):.1f}%
        - Conversion Rate: {(booked_count/sent_count*100 if sent_count > 0 else 0):.1f}%
        
        🎯 Top Performers (by template):
        """
        
        # Group by template type
        template_stats = {}
        for entry in self.outreach_log:
            template = entry['template_type']
            if template not in template_stats:
                template_stats[template] = {'sent': 0, 'replied': 0}
            template_stats[template]['sent'] += 1
            if entry['status'] == 'replied':
                template_stats[template]['replied'] += 1
        
        for template, stats in template_stats.items():
            reply_rate = (stats['replied']/stats['sent']*100 if stats['sent'] > 0 else 0)
            report += f"\n  - {template.title()}: {stats['sent']} sent, {stats['replied']} replies ({reply_rate:.1f}%)"
        
        report += f"""
        
        📅 Next Week's Plan:
        1. Follow up with {replied_count} surgeons who replied
        2. Research 20 new surgeons
        3. Send initial outreach to 15 new surgeons
        4. Schedule 5 partnership calls
        
        ============================================
        """
        
        print(report)
        
        # Save report to file
        report_filename = f"outreach_report_week{datetime.now().strftime('%U')}.txt"
        with open(report_filename, 'w', encoding='utf-8') as file:
            file.write(report)
        
        print(f"Report saved to: {report_filename}")
        return report

def main():
    """Main function"""
    outreach = SurgeonOutreach()
    
    print("=" * 50)
    print("SURGERYPREVIEW - SURGEON OUTREACH MANAGER")
    print("=" * 50)
    
    while True:
        print("\nOptions:")
        print("1. Generate CSV template for surgeon data")
        print("2. Load surgeons from CSV")
        print("3. Create weekly outreach plan")
        print("4. Generate email templates")
        print("5. Generate weekly report")
        print("6. Exit")
        
        choice = input("\nEnter your choice (1-6): ").strip()
        
        if choice == "1":
            filename = outreach.generate_csv_template()
            print(f"\nPlease fill out {filename} with surgeon data.")
            print("You can find NYC surgeons on RealSelf.com")
            
        elif choice == "2":
            csv_file = input("Enter CSV filename: ").strip()
            if outreach.load_surgeons_from_csv(csv_file):
                print(f"Successfully loaded {len(outreach.surgeons)} surgeons")
                
        elif choice == "3":
            if not outreach.surgeons:
                print("Please load surgeons first (option 2)")
                continue
            
            num_surgeons = int(input("How many surgeons to outreach this week? (default: 10): ") or "10")
            plan = outreach.create_outreach_plan(num_surgeons)
            
            print("\n📅 Weekly Outreach Plan:")
            for day, surgeons in plan.items():
                print(f"\n{day.title()}:")
                for surgeon in surgeons:
                    print(f"  - Dr. {surgeon.get('First Name', '')} {surgeon.get('Last Name', '')}")
            
        elif choice == "4":
            if not outreach.surgeons:
                print("Please load surgeons first (option 2)")
                continue
            
            surgeon_idx = int(input(f"Select surgeon (0-{len(outreach.surgeons)-1}): "))
            template_type = input("Template type (initial/follow_up/social_proof): ").strip()
            
            email_data = outreach.generate_email_template(
                outreach.surgeons[surgeon_idx], 
                template_type
            )
            
            print(f"\n📧 Email for {email_data['surgeon_name']}:")
            print(f"\nSubject: {email_data['subject']}")
            print(f"\nBody:\n{email_data['body']}")
            
            save = input("\nSave this email? (y/n): ").strip().lower()
            if save == 'y':
                outreach.track_outreach(email_data)
                
        elif choice == "5":
            outreach.generate_weekly_report()
            
        elif choice == "6":
            print("\nGoodbye! 🚀")
            break
            
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()