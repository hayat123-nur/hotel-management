import DocumentModel from '../models/Document';

/**
 * Migration script to remove the 'location' field from all existing documents
 * Run this once to clean up the database after removing the location field from the schema
 */
const removeLocationField = async () => {
  try {
    console.log('🔄 Starting migration: Removing location field from documents...');
    
    const result = await DocumentModel.updateMany(
      { location: { $exists: true } },
      { $unset: { location: '' } }
    );
    
    console.log(`✅ Migration complete: Updated ${result.modifiedCount} documents`);
    
    // Verify
    const remainingCount = await DocumentModel.countDocuments({ location: { $exists: true } });
    console.log(`📊 Documents with location field remaining: ${remainingCount}`);
    
    if (remainingCount === 0) {
      console.log('✅ All location fields successfully removed!');
    } else {
      console.warn('⚠️ Some documents still have location field');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

export default removeLocationField;
