export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      userName,
      headline,
      location,
      gender,
      skills,
      education,
      experience
    } = req.body;

    console.log('📝 Updating profile for user:', userId);
    console.log('📦 Received data:', req.body);

    // Handle file uploads
    const updateData = {
      firstName,
      lastName,
      userName,
      headline,
      location,
      gender
    };

    // Parse JSON strings if needed
    if (skills) {
      updateData.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    }
    if (education) {
      updateData.education = typeof education === 'string' ? JSON.parse(education) : education;
    }
    if (experience) {
      updateData.experience = typeof experience === 'string' ? JSON.parse(experience) : experience;
    }

    // Handle file uploads
    if (req.files) {
      if (req.files.profileImage) {
        updateData.profileImage = req.files.profileImage[0].filename;
      }
      if (req.files.coverImage) {
        updateData.coverImage = req.files.coverImage[0].filename;
      }
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ Profile updated successfully:', updatedUser._id);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};