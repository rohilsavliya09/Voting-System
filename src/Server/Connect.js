// server.js with enhanced validation and error handling
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection with error handling
mongoose.connect('mongodb://localhost:27017/Voting_Details', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  // You can emit a success event here if needed
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  // Alert for database connection error
  if (typeof window !== 'undefined') {
    alert('❌ Database Connection Failed: ' + err.message);
  }
});

// ========================= ENHANCED SCHEMAS WITH VALIDATION =========================

// Login Schema with comprehensive validation
const Login_Form = new mongoose.Schema({
  UserName: { 
    type: String, 
    required: [true, 'Username is required'], 
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [50, 'Username cannot exceed 50 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  Email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  PassWord: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    maxlength: [100, 'Password cannot exceed 100 characters']
  },
  userType: {
    type: String,
    required: [true, 'User type is required'],
    enum: {
      values: ['voter', 'candidate'],
      message: 'User type must be either "voter" or "candidate"'
    }
  }
}, { timestamps: true });

// Add pre-save middleware for password validation
Login_Form.pre('save', function(next) {
  if (this.PassWord.length < 6) {
    const error = new Error('Password must be at least 6 characters long');
    return next(error);
  }
  next();
});

const User = mongoose.model('User', Login_Form);

// Enhanced Voter Schema with validation
const voterSchema = new mongoose.Schema({
  full_name: { 
    type: String, 
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters long'],
    maxlength: [100, 'Full name cannot exceed 100 characters'],
    match: [/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces']
  },
  phone_number: { 
    type: String, 
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
    unique: [true, "Email already used, choose another email"]
  },
  address: { 
    type: String, 
    required: [true, 'Address is required'],
    minlength: [10, 'Address must be at least 10 characters long'],
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  birthdate: { 
    type: String, 
    required: [true, 'Birth date is required'],
    validate: {
      validator: function(v) {
        const date = new Date(v);
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        return age >= 18 && age <= 120;
      },
      message: 'Voter must be at least 18 years old and not older than 120 years'
    }
  },
  age: { 
    type: String, 
    required: [true, 'Age is required'],
    validate: {
      validator: function(v) {
        const age = parseInt(v);
        return age >= 18 && age <= 120;
      },
      message: 'Age must be between 18 and 120 years'
    }
  },
  user_id: { 
    type: String, 
    required: [true, 'User ID is required'],
    unique: [true, 'User ID already exists, choose another ID'],
    match: [/^[A-Z0-9]{8,}$/, 'User ID must be at least 8 characters long and contain only uppercase letters and numbers']
  },
  image: { 
    type: String, 
    default: null,
    validate: {
      validator: function(v) {
        if (v && !v.startsWith('data:image/') && !v.startsWith('http')) {
          return false;
        }
        return true;
      },
      message: 'Image must be a valid image URL or base64 data'
    }
  }
}, { timestamps: true });

const Voter = mongoose.model('Voter', voterSchema);

// Enhanced FormData Schema with validation
const FormDataSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Form title is required'], 
    trim: true,
    minlength: [3, 'Form title must be at least 3 characters long'],
    maxlength: [100, 'Form title cannot exceed 100 characters'],
    match: [/^[a-zA-Z0-9\s\-_]+$/, 'Form title can only contain letters, numbers, spaces, hyphens, and underscores']
  },
  numCandidates: { 
    type: Number, 
    required: [true, 'Number of candidates is required'], 
    min: [2, 'At least 2 candidates are required'],
    max: [20, 'Maximum 20 candidates allowed']
  },
  expiryDate: { 
    type: Date, 
    required: [true, 'Expiry date is required'],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  },
  Uid: { 
    type: String, 
    required: [true, 'Form UID is required'], 
    unique: [true, 'Form UID already exists, choose another UID'],
    match: [/^[A-Z0-9]{10,}$/, 'Form UID must be at least 10 characters long and contain only uppercase letters and numbers']
  }
}, { timestamps: true });

const Formdata = mongoose.model('Formdata', FormDataSchema);

// Enhanced Candidate Schema with validation
const candidateSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: [true, 'Full name is required'], 
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters long'],
    maxlength: [100, 'Full name cannot exceed 100 characters'],
    match: [/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces']
  },
  birthDate: { 
    type: Date, 
    required: [true, 'Birth date is required'],
    validate: {
      validator: function(v) {
        const today = new Date();
        const age = today.getFullYear() - v.getFullYear();
        return age >= 18 && age <= 80;
      },
      message: 'Candidate must be at least 18 years old and not older than 80 years'
    }
  },
  age: { 
    type: Number, 
    required: [true, 'Age is required'], 
    min: [18, 'Candidate must be at least 18 years old'],
    max: [80, 'Candidate cannot be older than 80 years']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    trim: true, 
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
    unique: [true, 'Email already used, choose another email']
  },
  mobile: { 
    type: String, 
    required: [true, 'Mobile number is required'], 
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  address: { 
    type: String, 
    required: [true, 'Address is required'], 
    trim: true,
    minlength: [10, 'Address must be at least 10 characters long'],
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  image: { 
    type: String, 
    default: null,
    validate: {
      validator: function(v) {
        if (v && !v.startsWith('data:image/') && !v.startsWith('http')) {
          return false;
        }
        return true;
      },
      message: 'Image must be a valid image URL or base64 data'
    }
  },
  voterIcon: { 
    type: String, 
    default: null,
    validate: {
      validator: function(v) {
        if (v && !v.startsWith('data:image/') && !v.startsWith('http')) {
          return false;
        }
        return true;
      },
      message: 'Voter icon must be a valid image URL or base64 data'
    }
  },
  Uid: { 
    type: String, 
    required: [true, 'Candidate UID is required'], 
    unique: [true, 'Candidate UID already exists, choose another UID'],
    match: [/^[A-Z0-9]{10,}$/, 'Candidate UID must be at least 10 characters long and contain only uppercase letters and numbers']
  },
  Form_Title: { 
    type: String, 
    required: [true, 'Form title is required'], 
    trim: true 
  },
  Form_Id: { 
    type: String, 
    required: [true, 'Form ID is required'] 
  }
}, { timestamps: true });

const Candidatedata = mongoose.model('Candidatedata', candidateSchema);

// Enhanced Voting Data Schema with validation
const votingSchema = new mongoose.Schema({
  candidateUid: { 
    type: String, 
    required: [true, 'Candidate UID is required'],
    match: [/^[A-Z0-9]{10,}$/, 'Candidate UID must be at least 10 characters long and contain only uppercase letters and numbers']
  },
  voterId: { 
    type: String, 
    required: [true, 'Voter ID is required'],
    match: [/^[A-Z0-9]{8,}$/, 'Voter ID must be at least 8 characters long and contain only uppercase letters and numbers']
  },
  formId: { 
    type: String, 
    required: [true, 'Form ID is required'] 
  },
  formTitle: { 
    type: String, 
    required: [true, 'Form title is required'] 
  },
  vote: { 
    type: Number, 
    default: 1,
    min: [1, 'Vote value must be at least 1'],
    max: [1, 'Vote value cannot exceed 1']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add compound index to prevent duplicate votes
votingSchema.index({ candidateUid: 1, voterId: 1, formId: 1 }, { unique: true });

const VotingData = mongoose.model('VotingData', votingSchema);

// ========================= ENHANCED ROUTES WITH SPECIFIC ERROR HANDLING =========================

// Enhanced error handling middleware with specific error messages
const handleError = (err, res) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.keys(err.errors).forEach(key => {
      errors[key] = err.errors[key].message;
    });
    return res.status(400).json({ 
      success: false,
      message: 'Validation Error',
      errors: errors 
    });
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    let message = '';
    
    switch(field) {
      case 'Email':
        message = 'Email already exists, please use a different email address';
        break;
      case 'user_id':
        message = 'User ID already exists, please choose a different ID';
        break;
      case 'Uid':
        message = 'UID already exists, please choose a different UID';
        break;
      default:
        message = `${field} already exists, please choose a different value`;
    }
    
    return res.status(400).json({ 
      success: false,
      message: message 
    });
  }
  
  return res.status(500).json({ 
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

// POST Routes with enhanced validation and specific error messages
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;
    
    // Specific field validation with custom messages
    if (!username) {
      return res.status(400).json({ 
        success: false,
        message: 'Username is required' 
      });
    }
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }
    
    if (!password) {
      return res.status(400).json({ 
        success: false,
        message: 'Password is required' 
      });
    }
    
    if (!userType) {
      return res.status(400).json({ 
        success: false,
        message: 'User type is required' 
      });
    }
    
    // Email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please enter a valid email address' 
      });
    }
    
    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
      });
    }
    
    // Username format validation
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ 
        success: false,
        message: 'Username can only contain letters, numbers, and underscores' 
      });
    }
    
    // Username length validation
    if (username.length < 3) {
      return res.status(400).json({ 
        success: false,
        message: 'Username must be at least 3 characters long' 
      });
    }
    
    // User type validation
    if (!['voter', 'candidate'].includes(userType)) {
      return res.status(400).json({ 
        success: false,
        message: 'User type must be either "voter" or "candidate"' 
      });
    }
    
    const existingUser = await User.findOne({ Email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered, please use a different email address' 
      });
    }

    const newUser = new User({ 
      UserName: username, 
      Email: email, 
      PassWord: password,
      userType: userType 
    });
    
    await newUser.save();
    res.status(201).json({ 
      success: true,
      message: 'User registered successfully!' 
    });
  } catch (err) {
    handleError(err, res);
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Specific field validation
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }
    
    if (!password) {
      return res.status(400).json({ 
        success: false,
        message: 'Password is required' 
      });
    }
    
    if (!userType) {
      return res.status(400).json({ 
        success: false,
        message: 'User type is required' 
      });
    }

    // Email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please enter a valid email address' 
      });
    }

    // Find user by email (case insensitive)
    const existingUser = await User.findOne({ 
      Email: { $regex: new RegExp(email, 'i') },
      userType: userType
    });

    if (!existingUser) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email, password, or user type' 
      });
    }

    // Compare passwords
    if (existingUser.PassWord !== password) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid password' 
      });
    }

    // Create user object without sensitive data
    const userResponse = {
      _id: existingUser._id,
      UserName: existingUser.UserName,
      Email: existingUser.Email,
      userType: existingUser.userType,
      createdAt: existingUser.createdAt
    };

    res.status(200).json({ 
      success: true,
      message: 'Login successful', 
      user: userResponse
    });

  } catch (err) {
    handleError(err, res);
  }
});

app.post('/api/users/voter', async (req, res) => {
  try {
    const { full_name, phone_number, email, address, birthdate, age, user_id, image } = req.body;
    
    // Specific field validation
    if (!full_name) {
      return res.status(400).json({ 
        success: false,
        message: 'Full name is required' 
      });
    }
    
    if (!phone_number) {
      return res.status(400).json({ 
        success: false,
        message: 'Phone number is required' 
      });
    }
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }
    
    if (!address) {
      return res.status(400).json({ 
        success: false,
        message: 'Address is required' 
      });
    }
    
    if (!birthdate) {
      return res.status(400).json({ 
        success: false,
        message: 'Birth date is required' 
      });
    }
    
    if (!age) {
      return res.status(400).json({ 
        success: false,
        message: 'Age is required' 
      });
    }
    
    if (!user_id) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID is required' 
      });
    }
    
    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please enter a valid 10-digit phone number' 
      });
    }
    
    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please enter a valid email address' 
      });
    }
    
    // Age validation
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      return res.status(400).json({ 
        success: false,
        message: 'Age must be between 18 and 120 years' 
      });
    }
    
    // User ID validation
    const userIdRegex = /^[A-Z0-9]{8,}$/;
    if (!userIdRegex.test(user_id)) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID must be at least 8 characters long and contain only uppercase letters and numbers' 
      });
    }
    
    const newVoter = new Voter(req.body);
    await newVoter.save();
    res.json({ 
      success: true,
      message: 'Voter uploaded successfully!' 
    });
  } catch (err) {
    handleError(err, res);
  }
});

app.post('/api/users/formdata', async (req, res) => {
  try {
    const { title, numCandidates, expiryDate, Uid } = req.body;
    
    // Specific field validation
    if (!title) {
      return res.status(400).json({ 
        success: false,
        message: 'Form title is required' 
      });
    }
    
    if (!numCandidates) {
      return res.status(400).json({ 
        success: false,
        message: 'Number of candidates is required' 
      });
    }
    
    if (!expiryDate) {
      return res.status(400).json({ 
        success: false,
        message: 'Expiry date is required' 
      });
    }
    
    if (!Uid) {
      return res.status(400).json({ 
        success: false,
        message: 'Form UID is required' 
      });
    }
    
    // Title validation
    if (title.length < 3) {
      return res.status(400).json({ 
        success: false,
        message: 'Form title must be at least 3 characters long' 
      });
    }
    
    // Number of candidates validation
    const numCandidatesNum = parseInt(numCandidates);
    if (isNaN(numCandidatesNum) || numCandidatesNum < 2 || numCandidatesNum > 20) {
      return res.status(400).json({ 
        success: false,
        message: 'Number of candidates must be between 2 and 20' 
      });
    }
    
    // Expiry date validation
    const expiryDateObj = new Date(expiryDate);
    if (expiryDateObj <= new Date()) {
      return res.status(400).json({ 
        success: false,
        message: 'Expiry date must be in the future' 
      });
    }
    
    // UID validation
    const uidRegex = /^[A-Z0-9]{10,}$/;
    if (!uidRegex.test(Uid)) {
      return res.status(400).json({ 
        success: false,
        message: 'Form UID must be at least 10 characters long and contain only uppercase letters and numbers' 
      });
    }
    
    const newForm = new Formdata(req.body);
    await newForm.save();
    res.json({ 
      success: true,
      message: 'Form Data uploaded successfully' 
    });
  } catch (err) {
    handleError(err, res);
  }
});

app.post('/api/users/candidate', async (req, res) => {
  try {
    const { fullName, birthDate, age, email, mobile, address, Uid, Form_Title, Form_Id } = req.body;
    
    // Specific field validation
    if (!fullName) {
      return res.status(400).json({ 
        success: false,
        message: 'Full name is required' 
      });
    }
    
    if (!birthDate) {
      return res.status(400).json({ 
        success: false,
        message: 'Birth date is required' 
      });
    }
    
    if (!age) {
      return res.status(400).json({ 
        success: false,
        message: 'Age is required' 
      });
    }
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }
    
    if (!mobile) {
      return res.status(400).json({ 
        success: false,
        message: 'Mobile number is required' 
      });
    }
    
    if (!address) {
      return res.status(400).json({ 
        success: false,
        message: 'Address is required' 
      });
    }
    
    if (!Uid) {
      return res.status(400).json({ 
        success: false,
        message: 'Candidate UID is required' 
      });
    }
    
    if (!Form_Title) {
      return res.status(400).json({ 
        success: false,
        message: 'Form title is required' 
      });
    }
    
    if (!Form_Id) {
      return res.status(400).json({ 
        success: false,
        message: 'Form ID is required' 
      });
    }
    
    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please enter a valid email address' 
      });
    }
    
    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please enter a valid 10-digit mobile number' 
      });
    }
    
    // Age validation
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 80) {
      return res.status(400).json({ 
        success: false,
        message: 'Age must be between 18 and 80 years' 
      });
    }
    
    // UID validation
    const uidRegex = /^[A-Z0-9]{10,}$/;
    if (!uidRegex.test(Uid)) {
      return res.status(400).json({ 
        success: false,
        message: 'Candidate UID must be at least 10 characters long and contain only uppercase letters and numbers' 
      });
    }
    
    const newCandidate = new Candidatedata(req.body);
    await newCandidate.save();
    res.json({ 
      success: true,
      message: 'Candidate uploaded successfully!' 
    });
  } catch (err) {
    handleError(err, res);
  }
});

app.post('/api/users/votingdata', async (req, res) => {
  try {
    const { candidateUid, voterId, formId, formTitle } = req.body;
    
    // Specific field validation
    if (!candidateUid) {
      return res.status(400).json({ 
        success: false,
        message: 'Candidate UID is required' 
      });
    }
    
    if (!voterId) {
      return res.status(400).json({ 
        success: false,
        message: 'Voter ID is required' 
      });
    }
    
    if (!formId) {
      return res.status(400).json({ 
        success: false,
        message: 'Form ID is required' 
      });
    }
    
    if (!formTitle) {
      return res.status(400).json({ 
        success: false,
        message: 'Form title is required' 
      });
    }
    
    // Check if user has already voted
    const existingVote = await VotingData.findOne({
      candidateUid: candidateUid,
      voterId: voterId,
      formId: formId
    });

    if (existingVote) {
      return res.status(400).json({ 
        success: false,
        message: 'You have already voted for this candidate in this election' 
      });
    }

    const newVote = new VotingData(req.body);
    await newVote.save();
    res.json({ 
      success: true,
      message: 'Vote recorded successfully!' 
    });
  } catch (err) {
    handleError(err, res);
  }
});

// GET Routes with error handling
app.get('/api/users/voter', async (req, res) => {
  try {
    const voters = await Voter.find();
    res.json({ 
      success: true,
      data: voters 
    });
  } catch (err) {
    handleError(err, res);
  }
});

app.get('/api/users/formdata', async (req, res) => {
  try {
    const forms = await Formdata.find();
    res.json({ 
      success: true,
      data: forms 
    });
  } catch (err) {
    handleError(err, res);
  }
});

app.get('/api/users/candidate', async (req, res) => {
  try {
    const candidates = await Candidatedata.find();
    res.json({ 
      success: true,
      data: candidates 
    });
  } catch (err) {
    handleError(err, res);
  }
});

app.get('/api/users/votingdata', async (req, res) => {
  try {
    const votes = await VotingData.find();
    res.json({ 
      success: true,
      data: votes 
    });
  } catch (err) {
    handleError(err, res);
  }
});

// Start server with error handling
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('❌ Server Error:', err);
  if (typeof window !== 'undefined') {
    alert('❌ Server failed to start: ' + err.message);
  }
});