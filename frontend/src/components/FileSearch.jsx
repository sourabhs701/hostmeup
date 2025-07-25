import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Fuse from "fuse.js";


export default function FileSearch({ files, onSearchResults }) {
    const [searchQuery, setSearchQuery] = useState("");


    const fuseOptions = {
        keys: [
            { name: 'name', weight: 0.7 },
            { name: 'uploadedAt', weight: 0.3 }
        ]
    };


    const fuse = useMemo(() => new Fuse(files, fuseOptions), [files]);


    const filteredFiles = useMemo(() => {
        if (!searchQuery.trim()) {
            return files;
        }
        const results = fuse.search(searchQuery);
        return results.map(result => result.item);
    }, [files, searchQuery, fuse]);


    useEffect(() => {
        onSearchResults(filteredFiles, searchQuery);
    }, [filteredFiles, searchQuery, onSearchResults]);


    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };


    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 w-64"
            />
        </div>
    );
}