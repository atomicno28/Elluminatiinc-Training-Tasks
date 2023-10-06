// OUTPUT

// A B C D E F 
// A B C D E 
// A B C D 
// A B C 
// A B  
// A 
// A B 
// A B C 
// A B C D 
// A B C D E 
// A B C D E F

#include<iostream>
using namespace std;
int main()
{
    int n; cin>>n;
    
    for(int i=0;i<n;i++)
    {
        for(int j=1;j<=n;j++)
        {
            if(j<n+1-i) cout << (char)(64+j)<<" ";
            
        }
        
        if(i<n-1) cout<<endl;
    }
    cout << endl;
    for(int i=1;i<n;i++)
    {
        for(int j=1;j<=i+1;j++)
        {
    
            cout <<(char)(64+j) << " ";
        }
        cout <<endl;
    }
}