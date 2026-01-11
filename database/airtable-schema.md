# Airtable Database Schema

## Table 1: Leads

**Description**: Patient leads captured from the website

| Field Name | Type | Description | Required |
|------------|------|-------------|----------|
| Name | Single line text | Patient's full name | Yes |
| Email | Email | Patient's email address | Yes |
| Phone | Phone number | Patient's phone number | Yes |
| Procedure | Single select | Desired procedure | Yes |
| Location | Single select | Preferred location | Yes |
| Timeline | Single select | When they want surgery | No |
| Notes | Long text | Additional notes/questions | No |
| Status | Single select | Lead status | Yes |
| CreatedAt | Date | When lead was captured | Yes |
| PhotoURL | URL | Link to uploaded photo (optional) | No |
| Budget | Single select | Budget range | No |
| Age | Number | Patient age | No |
| Gender | Single select | Patient gender | No |
| Source | Single select | How they found us | No |

**Procedure Options**:
- Rhinoplasty (Nose Job)
- Breast Augmentation
- Facelift
- Liposuction
- Brazilian Butt Lift (BBL)
- Chin Augmentation
- Tummy Tuck
- Eyelid Surgery (Blepharoplasty)
- Other

**Location Options**:
- NYC - Manhattan
- NYC - Brooklyn
- NYC - Queens
- Long Island
- New Jersey
- Los Angeles (Coming Soon)

**Status Options**:
- New
- Contacted
- Booked
- Lost
- Archived

**Timeline Options**:
- 1-3 months
- 3-6 months
- 6-12 months
- Just researching

## Table 2: Surgeons

**Description**: Board-certified plastic surgeons in our network

| Field Name | Type | Description | Required |
|------------|------|-------------|----------|
| Name | Single line text | Surgeon's full name | Yes |
| Email | Email | Surgeon's email | Yes |
| Phone | Phone number | Surgeon's phone | Yes |
| Specialties | Multiple select | Procedures they perform | Yes |
| Location | Single select | Practice location | Yes |
| PriceRange | Single line text | Typical price range | No |
| RealSelfRating | Number | RealSelf rating (0-5) | No |
| ReviewCount | Number | Number of reviews | No |
| Website | URL | Practice website | No |
| Status | Single select | Account status | Yes |
| CommissionRate | Currency | Per-booking fee | Yes |
| YearsExperience | Number | Years in practice | No |
| BoardCertified | Checkbox | Board certified status | Yes |
| HospitalAffiliation | Single line text | Hospital affiliation | No |
| Education | Long text | Medical education | No |
| Notes | Long text | Internal notes | No |
| JoinedDate | Date | When they joined | Yes |
| TotalLeadsSent | Number | Leads sent to date | No |
| TotalBookings | Number | Bookings to date | No |
| ResponseRate | Formula | (Bookings/Leads)*100 | Auto |
| AverageResponseTime | Number | Hours to respond (avg) | No |

**Status Options**:
- Active
- Inactive
- Pending
- Suspended

**Commission Rate**: Default $75.00

## Table 3: LeadDistribution

**Description**: Tracks which leads were sent to which surgeons

| Field Name | Type | Description | Required |
|------------|------|-------------|----------|
| Lead | Link to Leads | Reference to lead | Yes |
| Surgeon | Link to Surgeons | Reference to surgeon | Yes |
| SentAt | Date | When lead was sent | Yes |
| Status | Single select | Distribution status | Yes |
| OpenedAt | Date | When email was opened | No |
| ContactedAt | Date | When surgeon contacted patient | No |
| BookedAt | Date | When consultation was booked | No |
| Notes | Long text | Internal notes | No |
| EmailMessageId | Single line text | SendGrid message ID | No |

**Status Options**:
- Sent
- Opened
- Contacted
- Booked
- Lost
- Expired

## Table 4: Bookings

**Description**: Tracks booked consultations for billing

| Field Name | Type | Description | Required |
|------------|------|-------------|----------|
| Lead | Link to Leads | Reference to lead | Yes |
| Surgeon | Link to Surgeons | Reference to surgeon | Yes |
| BookingDate | Date | Consultation date | Yes |
| CommissionOwed | Currency | Amount owed ($75) | Yes |
| CommissionPaid | Checkbox | Payment status | Yes |
| PaymentDate | Date | When payment was received | No |
| InvoiceNumber | Single line text | Invoice reference | No |
| Notes | Long text | Booking notes | No |
| ProcedureConfirmed | Single select | Procedure discussed | No |
| EstimatedProcedureDate | Date | When surgery might happen | No |
| EstimatedProcedureCost | Currency | Estimated surgery cost | No |
| FollowUpDate | Date | When to follow up | No |

**CommissionOwed**: Default $75.00

## Table 5: Analytics (Optional)

**Description**: Daily/weekly/monthly analytics

| Field Name | Type | Description |
|------------|------|-------------|
| Date | Date | Analytics date |
| TotalLeads | Number | Leads captured |
| TotalBookings | Number | Consultations booked |
| ConversionRate | Formula | (Bookings/Leads)*100 |
| Revenue | Currency | Commission revenue |
| LeadsByProcedure | Long text | JSON of leads by procedure |
| LeadsByLocation | Long text | JSON of leads by location |
| TopSurgeon | Single line text | Surgeon with most bookings |
| Notes | Long text | Analysis notes |

## Views for Each Table

### Leads Table Views:
1. **All Leads** (default)
2. **New Leads** (Status = "New")
3. **Booked Leads** (Status = "Booked")
4. **This Week** (CreatedAt = this week)
5. **By Procedure** (grouped by procedure)

### Surgeons Table Views:
1. **Active Surgeons** (Status = "Active")
2. **By Location** (grouped by location)
3. **By Specialty** (grouped by specialty)
4. **Top Performers** (sorted by TotalBookings)
5. **Pending Approval** (Status = "Pending")

### LeadDistribution Table Views:
1. **Recent Distributions** (SentAt = last 7 days)
2. **Not Contacted** (Status = "Sent")
3. **Booked** (Status = "Booked")
4. **By Surgeon** (grouped by surgeon)

### Bookings Table Views:
1. **Unpaid Commissions** (CommissionPaid = false)
2. **This Month** (BookingDate = this month)
3. **By Surgeon** (grouped by surgeon)
4. **Upcoming** (BookingDate >= today)

## Automation Rules

### 1. Lead Status Update
- When LeadDistribution.Status changes to "Booked"
- Update Leads.Status to "Booked"
- Update Leads.BookedWith to surgeon name

### 2. Surgeon Performance Tracking
- When Bookings record is created
- Increment Surgeons.TotalBookings by 1
- Recalculate Surgeons.ResponseRate

### 3. Commission Tracking
- When Bookings.CommissionPaid is checked
- Set Bookings.PaymentDate to today
- Send payment confirmation email

## API Integration Notes

### Base Configuration
- **Base ID**: Found in Airtable API documentation
- **API Key**: Generate from account settings
- **Rate Limits**: 5 requests per second (free tier)

### Webhooks (Optional)
- Setup webhook for new leads
- Trigger email automation
- Update external dashboards

### Security
- Never expose API key in frontend code
- Use environment variables
- Restrict API key permissions
- Regularly rotate API keys

## Sample Data

### Sample Lead:
```json
{
  "Name": "Sarah Johnson",
  "Email": "sarah@email.com",
  "Phone": "(212) 555-0100",
  "Procedure": "Rhinoplasty",
  "Location": "NYC - Manhattan",
  "Timeline": "1-3 months",
  "Notes": "Interested in refining nasal bridge and tip",
  "Status": "New",
  "CreatedAt": "2026-01-11T14:30:00Z"
}
```

### Sample Surgeon:
```json
{
  "Name": "Dr. Michael Smith",
  "Email": "contact@drmichaelsmith.com",
  "Phone": "(212) 555-1234",
  "Specialties": ["Rhinoplasty", "Facelift"],
  "Location": "NYC - Manhattan",
  "PriceRange": "$8,000 - $12,000",
  "RealSelfRating": 4.9,
  "ReviewCount": 247,
  "Website": "https://drmichaelsmith.com",
  "Status": "Active",
  "CommissionRate": 75.00,
  "BoardCertified": true,
  "JoinedDate": "2026-01-10"
}
```

## Maintenance Tasks

### Daily:
- Check for new leads
- Verify email deliveries
- Update lead statuses
- Follow up with surgeons

### Weekly:
- Add new surgeons to database
- Update surgeon ratings/reviews
- Generate weekly analytics report
- Process commission payments

### Monthly:
- Archive old leads (90+ days)
- Review surgeon performance
- Update pricing/commission rates
- Backup database