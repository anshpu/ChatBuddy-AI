import React from 'react'
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";
import AssistantCard from "@/components/ui/AssistantCard";
import {images} from "@/constants/images";
import {ScrollView, View} from "react-native";

// TypeScript types for section and item
type AssistantItem = {
    title: string;
    description: string;
    icon: any;
};
type AssistantSection = {
    title: string;
    items: AssistantItem[];
};

// Move sections array outside the component for performance
const sections: AssistantSection[] = [
    {
        title: 'Image Generator',
        items: [
            {
                title: 'Image Generator',
                description: 'Generate images from text prompts using AI.',
                icon: images.movie,
            },
        ],
    },
    {
        title: 'Writing Assistants',
        items: [
            {
                title: 'Write an Article',
                description: 'Generate well-written article on any topic you want.',
                icon: images.article,
            },
            {
                title: 'Academic Writer',
                description: 'Generate educational writing such as essays, reports, etc.',
                icon: images.academic,
            },
            {
                title: 'Summarize (TL;DR)',
                description: 'Extract key points from long texts.',
                icon: images.summarize,
            },
            {
                title: 'Translate Language',
                description: 'Translate from one language to another.',
                icon: images.translate,
            },
            {
                title: 'Plagiarism Checker',
                description: 'Check the level of text plagiarism with AI.',
                icon: images.plagiarism,
            }
        ],
    },
    {
        title: 'Creative',
        items: [
            {
                title: 'Songs/Lyrics',
                description: 'Generate lyrics from any music genre you want.',
                icon: images.song,
            },
            {
                title: 'Storyteller',
                description: 'Generate stories from any given topic.',
                icon: images.storyteller,
            },
            {
                title: 'Poems',
                description: 'Generate poems in different styles.',
                icon: images.poems,
            },
            {
                title: 'Movie Script',
                description: 'Generate the script for the movie.',
                icon: images.movie,
            }
        ],
    },
    {
        title: 'Business',
        items: [
            {
                title: 'Email Writer',
                description: 'Generate templates for emails, letters, etc.',
                icon: images.email,
            },
            {
                title: 'Answer Interviewer',
                description: 'Generate answers to interview questions.',
                icon: images.interview,
            },
            {
                title: 'Job Post',
                description: 'Write ideal job descriptions for posting.',
                icon: images.job,
            },
            {
                title: 'Advertisements',
                description: 'Generate promotional text for products, services, brands, etc.',
                icon: images.advertisement,
            }
        ],
    },
    {
        title: 'Social Media',
        items: [
            {
                title: 'LinkedIn',
                description: 'Create attention-grabbing posts on LinkedIn.',
                icon: images.linkedin,
            },
            {
                title: 'Instagram',
                description: 'Write captions that attract audience on Instagram.',
                icon: images.instagram,
            },
            {
                title: 'Twitter',
                description: 'Make tweets that catch the attention of readers on Twitter.',
                icon: images.twitter,
            },
            {
                title: 'TikTok',
                description: 'Create attention-grabbing and viral captions on TikTok.',
                icon: images.tiktok,
            },
            {
                title: 'Facebook',
                description: 'Create attention-grabbing posts on Facebook.',
                icon: images.fb,
            }
        ],
    },
    {
        title: 'Developer',
        items: [
            {
                title: 'Write Code',
                description: 'Write code in any programming language.',
                icon: images.code,
            },
            {
                title: 'Explain Code',
                description: 'Explain complicated programming code snippets.',
                icon: images.explainCode,
            },
        ],
    },
    {
        title: 'Personal',
        items: [
            {
                title: 'Birthday',
                description: 'Create sincere birthday wishes for loved ones.',
                icon: images.birthday,
            },
            {
                title: 'Apology',
                description: 'Make an apology for the mistakes that have been made.',
                icon: images.apology,
            },
            {
                title: 'Invitation',
                description: 'Write the perfect invitation for any event.',
                icon: images.invitation,
            },
        ],
    },
    {
        title: 'Others',
        items: [
            {
                title: 'Create Conversation',
                description: 'Create conversation templates for two or more people.',
                icon: images.conversation,
            },
            {
                title: 'Tell a Joke',
                description: 'Write funny jokes to tell your friends and make them laugh.',
                icon: images.joke,
            },
            {
                title: 'Food Recipes',
                description: 'Get any cooking recipes for food dishes.',
                icon: images.recipe,
            },
            {
                title: 'Diet Plan',
                description: 'Create meal plans and diets based on your preferences.',
                icon: images.diet,
            }
        ],
    },
];

const Assistants: React.FC = () => {
    return (
        <ThemedView isMain={true} className='flex-1 justify-start pt-4 pb-6 '>
            <ThemedText
                className='text-greyscale-900 dark:text-others-white'
                style={{
                    fontSize: 24,
                    lineHeight: 38,
                    textAlign: 'center',
                    fontWeight: '700',
                    marginBottom: 28,
                }}>
                AI Assistants
            </ThemedText>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {sections.map((section) => (
                    <View key={section.title} className="mb-6">
                        <View className="flex-row justify-between items-center px-4">
                            <ThemedText type='customText' className="text-2xl font-semibold text-greyscale-900 dark:text-others-white">{section.title}</ThemedText>
                            {/* Removed BackButton as it is misleading in this context */}
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="mt-4 ml-4"
                        >
                            {section.items.map((item) => (
                                <AssistantCard
                                    key={`${section.title}-${item.title}`}
                                    title={item.title}
                                    description={item.description}
                                    icon={item.icon}
                                    accessibilityLabel={`${item.title}: ${item.description}`}
                                />
                            ))}
                        </ScrollView>
                    </View>
                ))}
            </ScrollView>
        </ThemedView>
    )
}
export default Assistants
