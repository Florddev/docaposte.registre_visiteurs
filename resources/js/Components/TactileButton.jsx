import React from 'react';
import {Link} from "@inertiajs/react";

const TactileButton = ({title, subtitle, Icon, href, ...props}) => {
    return (
        <Link href={href ?? '#'} className="w-1/2 border-2 border-dashed border-primary rounded-lg p-16 flex items-start cursor-pointer hover:bg-primary/5 transition-colors"  {...props}>
            <Icon className="h-12 w-12 text-primary mr-4 flex-shrink-0" />
            <div>
                <h2 className="font-semibold text-lg">{title}</h2>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
        </Link>
    );
}

export default TactileButton;
