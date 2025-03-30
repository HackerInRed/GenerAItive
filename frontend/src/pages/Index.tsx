
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Brain, Edit, Video, Code, Share2, PenTool } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-vidsmith-darker to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Transform Your Videos with AI
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create compelling, engaging video content in seconds. 
              Our AI analyzes your footage and extracts the perfect moments.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/upload" className="btn-primary text-lg px-8 py-3 inline-block hover:bg-vidsmith-accent-light transition-colors">
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section - Revamped */}
      <section id="features" className="py-20 bg-gradient-to-b from-black to-vidsmith-darker text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Powerful <span className="text-vidsmith-accent">Features</span>
            </motion.h2>
            <motion.div 
              className="w-20 h-1 bg-vidsmith-accent mx-auto mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            ></motion.div>
            <motion.p 
              className="text-lg text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Our cutting-edge AI tools help you transform ordinary videos into extraordinary content
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            <FeatureCard 
              icon={<Brain className="w-8 h-8" />}
              title="AI-Powered Analysis"
              description="Our advanced AI understands your videos, identifies the most engaging moments, and creates perfect clips automatically."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Video className="w-8 h-8" />}
              title="Smart Format Adaptation"
              description="Create perfectly sized clips for any platform - YouTube, Instagram, TikTok, and more with intelligent aspect ratio adjustment."
              delay={0.2}
            />
            <FeatureCard 
              icon={<PenTool className="w-8 h-8" />}
              title="Caption Generation"
              description="Automatically add captions to your videos to increase engagement and accessibility across all platforms."
              delay={0.3}
            />
            <FeatureCard 
              icon={<Edit className="w-8 h-8" />}
              title="Seamless Editing"
              description="Get professional-quality edits with smooth transitions and perfectly timed cuts, all without manual editing."
              delay={0.4}
            />
            <FeatureCard 
              icon={<Code className="w-8 h-8" />}
              title="Advanced Customization"
              description="Fine-tune your results with custom queries to extract exactly the type of content you're looking for."
              delay={0.5}
            />
            <FeatureCard 
              icon={<Share2 className="w-8 h-8" />}
              title="Share Anywhere"
              description="Easily download your videos or share them directly to your social media platforms with a single click."
              delay={0.6}
            />
          </div>
        </div>
      </section>
      
      {/* How It Works - Revamped */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-vidsmith-darker to-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              How It <span className="text-vidsmith-accent">Works</span>
            </motion.h2>
            <motion.div 
              className="w-20 h-1 bg-vidsmith-accent mx-auto mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            ></motion.div>
            <motion.p 
              className="text-lg text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Four simple steps to transform your ordinary videos into engaging content
            </motion.p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Timeline */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-vidsmith-muted"></div>
              
              {/* Steps */}
              <div className="space-y-16 md:space-y-24">
                <WorkflowStep 
                  number="01"
                  title="Upload Your Video"
                  description="Upload any video file to our platform. We accept most video formats, with no complicated settings to worry about."
                  isLeft={true}
                  delay={0.1}
                />
                <WorkflowStep 
                  number="02"
                  title="Customize Options"
                  description="Choose your preferred aspect ratio, add captions, and tell us what kind of moments to extract with a simple query."
                  isLeft={false}
                  delay={0.2}
                />
                <WorkflowStep 
                  number="03"
                  title="AI Processing"
                  description="Our advanced AI analyzes your video, transcribes the content, and identifies the most engaging segments based on your preferences."
                  isLeft={true}
                  delay={0.3}
                />
                <WorkflowStep 
                  number="04"
                  title="Download & Share"
                  description="Get your perfectly edited clips ready to share directly to your social media platforms with just a click."
                  isLeft={false}
                  delay={0.4}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-vidsmith-accent/10 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ready to transform your videos?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of content creators who use our AI to create engaging video content faster than ever.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/upload" className="btn-primary text-lg px-8 py-3 inline-block hover:bg-vidsmith-accent-light transition-colors">
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="glass-panel p-6 rounded-lg border border-vidsmith-border hover:border-vidsmith-accent transition-all duration-300"
    >
      <div className="bg-vidsmith-accent/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-5 text-vidsmith-accent">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

// Workflow Step Component
const WorkflowStep = ({ number, title, description, isLeft, delay }) => {
  return (
    <div className="relative flex flex-col md:flex-row items-start">
      <motion.div 
        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
        className={`glass-panel p-8 rounded-lg border border-vidsmith-border ${isLeft ? 'md:mr-auto' : 'md:ml-auto'} md:w-5/12 z-10`}
      >
        <div className="flex items-center mb-4">
          <span className="text-4xl font-bold text-vidsmith-accent opacity-50 mr-3">{number}</span>
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <p className="text-gray-300">{description}</p>
      </motion.div>
      
      {/* Step circle on timeline (visible on md and up) */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-vidsmith-accent items-center justify-center z-10">
        <span className="font-bold text-white">{number.split('0')[1]}</span>
      </div>
    </div>
  );
};

export default Index;
