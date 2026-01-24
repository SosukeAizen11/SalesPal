import React, { useState } from 'react';
import { Globe, FileText, Image as ImageIcon, Briefcase } from 'lucide-react';
import FileUploadBox from '../components/FileUploadBox';
import ImageUploadGrid from '../components/ImageUploadGrid';
import LogoToggle from '../components/LogoToggle';
import Card from '../../../../components/ui/Card';
import Input from '../../../../components/ui/Input';
import Textarea from '../../../../components/ui/Textarea';

const Section = ({ title, icon: Icon, children, className = "" }) => (
    <Card className={className}>
        <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {children}
    </Card>
);

const StepBusinessInput = () => {
    // Local state for the step
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [description, setDescription] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [productImages, setProductImages] = useState([]);
    const [useLogo, setUseLogo] = useState(false);
    const [logoFile, setLogoFile] = useState(null);

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Website URL */}
            <Section title="Website URL" icon={Globe}>
                <Input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    helperText="We’ll analyze your website to understand your business and products automatically."
                />
            </Section>

            {/* Business Description */}
            <Section title="Business Description" icon={Briefcase}>
                <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="We sell premium real estate properties in South Mumbai..."
                    className="min-h-[120px] resize-y"
                />
            </Section>

            <div className="grid md:grid-cols-2 gap-6">
                {/* PDF Upload */}
                <Section title="Upload Brochure/PDF" icon={FileText}>
                    <FileUploadBox
                        selectedFile={pdfFile}
                        onFileSelect={setPdfFile}
                    />
                </Section>

                {/* Logo Toggle */}
                <Section title="Brand Identity" icon={Briefcase}>
                    <LogoToggle
                        useLogo={useLogo}
                        onToggle={setUseLogo}
                        logoFile={logoFile}
                        onLogoChange={setLogoFile}
                    />
                </Section>
            </div>

            {/* Product Images */}
            <Section title="Product / Service Images" icon={ImageIcon}>
                <ImageUploadGrid
                    images={productImages}
                    onImagesChange={setProductImages}
                />
            </Section>
        </div>
    );
};

export default StepBusinessInput;
