import React from 'react';
import Button from './components/Button'; // TypeScript version

// This will work perfectly and TypeScript will help you
const GoodExample = () => {
    const handleClick = () => console.log('Clicked!');

    return (
        <div>
            {/* ✅ TypeScript knows these are all valid */}
            <Button onClick={handleClick}>Save</Button>
            <Button className="mt-4">Cancel</Button>
            <Button onClick={handleClick} className="bg-red-500">Delete</Button>
        </div>
    );
};

// This will show TypeScript errors immediately
const BadExample = () => {
    return (
        <div>
            {/* ❌ TypeScript catches these mistakes */}
            <Button onClick="invalid">Save</Button>           // onClick should be function
            <Button variant="primary">Save</Button>           // variant doesn't exist
            <Button onClick={() => "test"} size="large">      // size doesn't exist
                Save
            </Button>
        </div>
    );
};

export default GoodExample;
